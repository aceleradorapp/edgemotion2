const { UserEvaluationAssignment, User, Evaluation, UserEvaluationAttempt } = require('../models');
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
        const evaluation = await Evaluation.findOne({ where: { guid: evaluationGuid } });
        if (!evaluation) {
          console.warn(`Avaliação com GUID ${evaluationGuid} não encontrada. Atribuição ignorada.`);
          continue;
        }
        actualEvaluationId = evaluation.id;
      } else if (evaluationId) {
        actualEvaluationId = evaluationId;
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
          attributes: ['status', 'score', 'isApproved', 'createdAt']
        });

        // Lógica para determinar o status e as chances restantes
        const attemptsMade = userAttempts.length;
        const hasPassed = userAttempts.some(a => a.isApproved);
        const status = hasPassed ? 'passed' : (attemptsMade > 0 ? 'completed' : 'not_started');
        const attemptsLeft = assignment.evaluation.maxAttempts === 0
          ? 'Ilimitadas'
          : assignment.evaluation.maxAttempts - attemptsMade;

        return {
          ...assignment.toJSON(),
          status,
          attemptsMade,
          attemptsLeft,
          // Opcional: Pegar o score da última tentativa
          lastAttemptScore: attemptsMade > 0 ? userAttempts[0].score : null
        };
      })
    );
    return assignments;
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

module.exports = UserEvaluationAssignmentService;