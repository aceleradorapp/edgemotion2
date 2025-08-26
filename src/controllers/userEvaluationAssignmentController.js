const UserEvaluationAssignmentService = require('../services/UserEvaluationAssignmentService');
const { User, Evaluation } = require('../models'); // Para validações ou buscas adicionais, se necessário

const UserEvaluationAssignmentController = {
  /**
   * @route POST /api/assignments
   * @description Atribui uma ou mais avaliações a usuários. (Apenas Admin)
   * @access Private (Auth Required, Role Admin/CompanyOwner)
   * @body {Array<Object>} - Ex: [{ userGuid: "...", evaluationGuid: "..." }]
   */
  async assign(req, res) {
    try {
      const assignmentsData = req.body; // Espera um array de atribuições
      const userRole = req.user.role;
      const userProfileId = req.user.profileId;

      if (!Array.isArray(assignmentsData) || assignmentsData.length === 0) {
        return res.status(400).json({ error: 'Dados de atribuição inválidos. Esperado um array de objetos.' });
      }

      // Validação de permissão: Apenas admins ou owners podem atribuir
      // if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      //   return res.status(403).json({ error: 'Permissão negada. Apenas administradores podem atribuir avaliações.' });
      // }

      if (userRole !== 'owner' && userRole !== 'admin' && !(userRole === 'user' && userProfileId === 1)) {
        return res.status(403).json({ error: 'Permissão negada. Apenas administradores podem atribuir avaliações.' });
      }

      // Você pode adicionar validações extras aqui, como verificar se o companyGuid do admin
      // corresponde ao companyGuid das avaliações ou usuários envolvidos, se aplicável.

      const createdAssignments = await UserEvaluationAssignmentService.assignEvaluations(assignmentsData);

      if (createdAssignments.length === 0) {
        return res.status(200).json({ message: 'Nenhuma nova atribuição criada (podem já existir ou dados inválidos).' });
      }

      return res.status(201).json({
        message: 'Atribuições criadas com sucesso!',
        assignments: createdAssignments.map(a => ({ guid: a.guid, userId: a.userId, evaluationId: a.evaluationId }))
      });
    } catch (error) {
      console.error('Erro ao atribuir avaliações:', error);
      return res.status(500).json({ error: error.message || 'Erro ao atribuir avaliações.' });
    }
  },

  /**
   * @route GET /api/users/:userGuid/assignments
   * @description Lista as avaliações atribuídas a um usuário específico. (Usuário ou Admin)
   * @access Private (Auth Required)
   */
  async getUserAssignments(req, res) {
    try {
      const { userGuid } = req.params;
      const requestingUserGuid = req.user.guid;
      const requestingUserId = req.user.id;

      // Validação de permissão: Usuário só pode ver suas próprias atribuições, admins podem ver de qualquer um
      let targetUserId;
      if (req.user.role === 'owner' || req.user.role === 'user') {
        const targetUser = await User.findOne({ where: { guid: userGuid } });
        if (!targetUser) {
          return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        targetUserId = targetUser.id;
      } else if (userGuid === requestingUserGuid) {
        targetUserId = requestingUserId;
      } else {
        return res.status(403).json({ error: 'Permissão negada para acessar as atribuições deste usuário.' });
      }

      const assignmentsWithMetrics = await UserEvaluationAssignmentService.getAssignmentsForUser(targetUserId);

      // return res.json({
      //   total: assignments.length,
      //   assignments: assignments.map(a => ({
      //     guid: a.guid,
      //     evaluation: {
      //       guid: a.evaluation.guid,
      //       name: a.evaluation.name,
      //       description: a.evaluation.description,
      //       passingPercentage: a.evaluation.passingPercentage,
      //       maxAttempts: a.evaluation.maxAttempts,
      //       isActive: a.evaluation.isActive,
      //     },
      //     createdAt: a.createdAt,
      //   }))
      // });
      return res.json({
        total: assignmentsWithMetrics.length,
        assignments: assignmentsWithMetrics
      });
    } catch (error) {
      console.error('Erro ao listar atribuições do usuário:', error);
      return res.status(500).json({ error: error.message || 'Erro ao listar atribuições.' });
    }
  },

  /**
   * @route DELETE /api/assignments/:assignmentGuid
   * @description Remove uma atribuição específica. (Apenas Admin)
   * @access Private (Auth Required, Role Admin/CompanyOwner)
   */
  async remove(req, res) {
    try {
      const { assignmentGuid } = req.params;

      // Validação de permissão
      if (req.user.role !== 'owner' && req.user.role !== 'user') {
        return res.status(403).json({ error: 'Permissão negada. Apenas administradores podem remover atribuições.' });
      }

      const removed = await UserEvaluationAssignmentService.removeAssignment(assignmentGuid);

      if (!removed) {
        return res.status(404).json({ error: 'Atribuição não encontrada ou já removida.' });
      }

      return res.status(200).json({ message: 'Atribuição removida com sucesso.' });
    } catch (error) {
      console.error('Erro ao remover atribuição:', error);
      return res.status(500).json({ error: error.message || 'Erro ao remover atribuição.' });
    }
  },

  /**
   * @route GET /api/evaluations/:evaluationGuid/assigned-users
   * @description Lista os usuários atribuídos a uma avaliação específica. (Apenas Admin)
   * @access Private (Auth Required, Role Admin/CompanyOwner)
   */
  async getAssignedUsers(req, res) {
    try {
      const { evaluationGuid } = req.params;
      const userRole = req.user.role;
      const userProfileId = req.user.profileId;

      // Validação de permissão
      // if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      //   return res.status(403).json({ error: 'Permissão negada. Apenas administradores podem ver usuários atribuídos.' });
      // }

      if (userRole !== 'owner' && !(userRole === 'user' && userProfileId === 1)) {
        return res.status(403).json({ error: 'Permissão negada. Apenas administradores podem ver usuários atribuídos.' });
      }

      const assignments = await UserEvaluationAssignmentService.getAssignedUsersForEvaluation(evaluationGuid);

      return res.json({
        total: assignments.length,
        assignments: assignments.map(a => ({
          guid: a.guid,
          user: {
            guid: a.user.guid,
            email: a.user.email,
            displayName: a.user.displayName,
            companyGuid: a.user.companyGuid,
          },
          evaluation: {
            guid: a.evaluation.guid,
            name: a.evaluation.name,
          },
          createdAt: a.createdAt,
        }))
      });
    } catch (error) {
      console.error('Erro ao listar usuários atribuídos à avaliação:', error);
      return res.status(500).json({ error: error.message || 'Erro ao listar usuários atribuídos.' });
    }
  },
};

module.exports = UserEvaluationAssignmentController;