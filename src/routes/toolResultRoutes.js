// src/routes/toolResultRoutes.js
const express = require('express');
const router = express.Router();
const toolResultController = require('../controllers/toolResultController');
const authenticateToken = require('../middlewares/authMiddleware');

// Protege apenas leitura, envio de resultados pode ser público dependendo da estratégia
router.post('/', toolResultController.create);
router.get('/tool/:toolInstanceId', authenticateToken, toolResultController.byToolInstance);
router.get('/participant/:participantId', authenticateToken, toolResultController.byParticipant);

module.exports = router;
