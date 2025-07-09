// src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

// Criar nova mensagem
router.post('/', messageController.create);

// Listar mensagens recebidas do usuário autenticado
router.get('/received', messageController.listReceived);

// Marcar mensagem como lida
router.put('/:id/read', messageController.markAsRead);

// Marcar mensagem como deletada (soft delete para o destinatário)
router.put('/:messageId/delete', messageController.markAsDeleted);

module.exports = router;
