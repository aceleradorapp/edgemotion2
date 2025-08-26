const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const userEvaluationAttemptController = require('../controllers/userEvaluationAttemptController'); // Importa o novo controlador
const authenticateToken = require('../middlewares/authMiddleware');

// Rotas para gerenciamento de Avaliações (Admin/Company Owner)
router.post('/evaluations', authenticateToken, evaluationController.create);
router.get('/evaluations', authenticateToken, evaluationController.list);
router.get('/evaluations/:guid', authenticateToken, evaluationController.getByGuid);
router.put('/evaluations/:guid', authenticateToken, evaluationController.update);
router.delete('/evaluations/:guid', authenticateToken, evaluationController.delete);

router.post('/evaluations/:guid/duplicate', authenticateToken, evaluationController.duplicate);

// NOVAS ROTAS para execução de Avaliações (Usuário)
router.post('/evaluations/:guid/start', authenticateToken, userEvaluationAttemptController.start);
router.post('/evaluations/attempts/:attemptGuid/answer', authenticateToken, userEvaluationAttemptController.answer);
router.post('/evaluations/attempts/:attemptGuid/finish', authenticateToken, userEvaluationAttemptController.finish);

router.get('/evaluations/attempts/:attemptGuid', authenticateToken, userEvaluationAttemptController.getAttemptResult);

// Adicionar um endpoint para listar as tentativas de um usuário específico
//router.get('/users/attempts', authenticateToken, userEvaluationAttemptController.listUserAttempts); // Exemplo de endpoint, vamos criar o método no próximo passo
router.get('/users/:userGuid/attempts', authenticateToken, userEvaluationAttemptController.listUserAttempts);

router.get('/evaluations/:evaluationGuid/ranking', authenticateToken, userEvaluationAttemptController.getRanking);


module.exports = router;