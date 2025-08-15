const { UserEvaluationAssignment, User, Evaluation, UserEvaluationAttempt, Message, MessageRecipient } = require('../models');
const { Op } = require('sequelize');

const UserEvaluationAssignmentService = {
  /**
   * Atribui uma ou mais avaliações a um ou mais usuários.
   * @param {Array<Object>} assignmentsData - Array de objetos { userId, evaluationId } ou { userGuid, evaluationGuid }.
   * @returns {Array<Object>} As atribuições criadas.
   */
  async assignEvaluations(assignmentsData) {
    const createdAssignments = [];
    for (const data of assignmentsData) {
      const { userId, userGuid, evaluationId, evaluationGuid } = data;

      let actualUserId;
      let actualEvaluationId;      
      let evaluation;

      // Resolver IDs a partir de GUIDs, se fornecidos
      if (userGuid) {
        const user = await User.findOne({ where: { guid: userGuid } });
        if (!user) {
          console.warn(`Usuário com GUID ${userGuid} não encontrado. Atribuição ignorada.`);
          continue;
        }
        actualUserId = user.id;
      } else if (userId) {
        actualUserId = userId;
      } else {
        console.warn('userId ou userGuid não fornecido para atribuição. Atribuição ignorada.');
        continue;
      }

      if (evaluationGuid) {
        evaluation = await Evaluation.findOne({ where: { guid: evaluationGuid } });
        if (!evaluation) {
          console.warn(`Avaliação com GUID ${evaluationGuid} não encontrada. Atribuição ignorada.`);
          continue;
        }
        actualEvaluationId = evaluation.id;
      } else if (evaluationId) {
        actualEvaluationId = evaluationId;
        evaluation = await Evaluation.findByPk(evaluationId);
      } else {
        console.warn('evaluationId ou evaluationGuid não fornecido para atribuição. Atribuição ignorada.');
        continue;
      }

      // Verificar se a atribuição já existe para evitar duplicatas e erro de unique constraint
      const existingAssignment = await UserEvaluationAssignment.findOne({
        where: {
          userId: actualUserId,
          evaluationId: actualEvaluationId,
        },
      });

      if (existingAssignment) {
        console.warn(`Atribuição já existe para o usuário ${actualUserId} e avaliação ${actualEvaluationId}.`);
        continue; // Pular para a próxima atribuição
      }

      try {
        const newAssignment = await UserEvaluationAssignment.create({
          userId: actualUserId,
          evaluationId: actualEvaluationId,
        });
        createdAssignments.push(newAssignment);

        await sendUserRegistrationMessage(actualUserId, evaluation);

      } catch (error) {
        console.error(`Erro ao criar atribuição para usuário ${actualUserId}, avaliação ${actualEvaluationId}:`, error);
        // Dependendo da sua necessidade, você pode relançar o erro ou apenas logar
      }
    }

    return createdAssignments;
  },

  /**
   * Lista as avaliações atribuídas a um usuário específico.
   * @param {number} userId - O ID do usuário.
   * @returns {Array<Object>} Lista de atribuições com detalhes da avaliação.
   */
  async getAssignmentsForUser(userId) {
    const assignments = await UserEvaluationAssignment.findAll({
      where: { userId },
      include: [
        {
          model: Evaluation,
          as: 'evaluation',
          attributes: ['guid', 'name', 'description', 'passingPercentage', 'maxAttempts', 'isActive'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const assignmentsWithMetrics = await Promise.all(
      assignments.map(async (assignment) => {
        const userAttempts = await UserEvaluationAttempt.findAll({
          where: { userId: assignment.userId, evaluationId: assignment.evaluationId },
          attributes: ['status', 'score', 'isApproved', 'createdAt'],
          order: [['createdAt', 'DESC']],
        });

        // Lógica para determinar o status e as chances restantes
        const attemptsMade = userAttempts.length;

        // CORREÇÃO: Adicionando verificação para o status 'in_progress'
        const hasPassed = userAttempts.some(a => a.isApproved);
        const inProgress = userAttempts.some(a => a.status === 'in_progress' || a.status === 'started');

        let status;
        if (hasPassed) {
          status = 'passed';
        } else if (inProgress) {
          status = 'in_progress';
        } else if (attemptsMade > 0) {
          status = 'completed';
        } else {
          status = 'not_started';
        }

        // Se maxAttempts for 0, as chances são ilimitadas, caso contrário, calcula as restantes
        const attemptsLeft = assignment.evaluation.maxAttempts === 0
          ? 'Ilimitadas'
          : assignment.evaluation.maxAttempts - attemptsMade;

        return {
          ...assignment.toJSON(),
          status,
          attemptsMade,
          attemptsLeft,
          // Pega o score da última tentativa, se existir
          lastAttemptScore: attemptsMade > 0 ? userAttempts[0].score : null
        };
      })
    );

    // Retornar a variável que contém as métricas calculadas.
    return assignmentsWithMetrics;
  },

  /**
   * Remove uma atribuição específica.
   * @param {string} assignmentGuid - GUID da atribuição a ser removida.
   * @returns {boolean} True se a atribuição foi removida, false caso contrário.
   */
  async removeAssignment(assignmentGuid) {
    const result = await UserEvaluationAssignment.destroy({
      where: { guid: assignmentGuid },
    });
    return result > 0; // Retorna true se pelo menos 1 linha foi afetada
  },

  /**
   * Lista todos os usuários atribuídos a uma avaliação específica.
   * @param {string} evaluationGuid - GUID da avaliação.
   * @returns {Array<Object>} Lista de atribuições com detalhes do usuário.
   */
  async getAssignedUsersForEvaluation(evaluationGuid) {
    const evaluation = await Evaluation.findOne({ where: { guid: evaluationGuid } });
    if (!evaluation) {
      throw new Error('Avaliação não encontrada.');
    }

    const assignments = await UserEvaluationAssignment.findAll({
      where: { evaluationId: evaluation.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['guid', 'email', 'displayName', 'companyGuid'],
        },
        {
          model: Evaluation,
          as: 'evaluation',
          attributes: ['guid', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return assignments;
  },
};

async function sendUserRegistrationMessage(actualUserId, evaluation) {
    try {
        const senderId = actualUserId;

        const title = `Nova Avaliação Vinculada: ${evaluation.name}`;
        const content = `
Você tem uma nova avalição vinculada ao seu usário:
- Avaliação: ${evaluation.name}
- Descrição: ${evaluation.description || 'Sem descrição'}
- Total de Tentativas: ${evaluation.maxAttempts}
- Percentual de Aprovação: ${evaluation.passingPercentage * 100}%

Acesse minhas avaliações no menu para começar a avaliação.
Obrigado por usar nosso sistema! Se tiver dúvidas, entre em contato com o suporte.
Boa sorte! `.trim();

        const message = await Message.create({ senderId, title, content });

        await MessageRecipient.create({
            messageId: message.id,
            recipientId: [senderId]
        });

    } catch (err) {
        console.error('Erro ao enviar mensagem para o administrador:', err);
    }
}

module.exports = UserEvaluationAssignmentService;