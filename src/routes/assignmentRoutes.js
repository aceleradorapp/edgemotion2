const express = require('express');
const router = express.Router();
const userEvaluationAssignmentController = require('../controllers/userEvaluationAssignmentController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rotas para Atribuição de Avaliações (Admin)
router.post('/assignments', authenticateToken, userEvaluationAssignmentController.assign);
router.delete('/assignments/:assignmentGuid', authenticateToken, userEvaluationAssignmentController.remove);

// Rotas para listar atribuições (Admin e Usuário)
router.get('/users/:userGuid/assignments', authenticateToken, userEvaluationAssignmentController.getUserAssignments);
router.get('/evaluations/:evaluationGuid/assigned-users', authenticateToken, userEvaluationAssignmentController.getAssignedUsers);

module.exports = router;