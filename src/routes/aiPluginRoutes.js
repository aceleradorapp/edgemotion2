// src/routes/aiPluginRoutes.js
const express = require('express');
const router = express.Router();
const aiPluginController = require('../controllers/aiPluginController');
const authenticateToken = require('../middlewares/authMiddleware');

// Middleware para verificar o papel de 'owner'
const checkOwnerRole = aiPluginController.checkOwnerRole;

// Rota para listar plugins disponíveis para o usuário autenticado
router.get('/ai/plugins', authenticateToken, aiPluginController.getAvailablePlugins);

// Rotas exclusivas para o 'owner'
router.post('/ai/plugins', authenticateToken, checkOwnerRole, aiPluginController.create);
router.get('/ai/plugins/all', authenticateToken, checkOwnerRole, aiPluginController.listAll);
router.put('/ai/plugins/:guid', authenticateToken, checkOwnerRole, aiPluginController.update);
router.delete('/ai/plugins/:guid', authenticateToken, checkOwnerRole, aiPluginController.delete);
router.put('/ai/plugins/:guid/access', authenticateToken, checkOwnerRole, aiPluginController.setAccess);

// Exemplo de rota de execução de um plugin
// Esta rota usará o middleware 'checkPluginAccess' que criamos no controlador
router.post('/ai/plugins/execute/:guid', authenticateToken, aiPluginController.checkPluginAccess, aiPluginController.executePluginExample);

module.exports = router;