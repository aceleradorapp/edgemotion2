// src/routes/aiConfigRoutes.js
const express = require('express');
const router = express.Router();
const aiConfigController = require('../controllers/aiConfigController');
const authenticateToken = require('../middlewares/authMiddleware');

// Rotas para gerenciar configurações de IA
router.post('/ai/configs', authenticateToken, aiConfigController.register);
router.get('/ai/configs', authenticateToken, aiConfigController.listAll);
router.put('/ai/configs/active/:guid', authenticateToken, aiConfigController.setActive);
router.delete('/ai/configs/:guid', authenticateToken, aiConfigController.delete);

module.exports = router;