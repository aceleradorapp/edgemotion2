const express = require('express');
const router = express.Router();
const emailConfigController = require('../controllers/EmailConfigController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeOwner = require('../middlewares/authorizeOwner');

router.use(authenticateToken);

// Criar nova configuração de e-mail
router.post('/', authorizeOwner, emailConfigController.createConfig);

// Listar configuração por companyGuid
router.get('/', authorizeOwner, emailConfigController.getConfig);

// Atualizar uma configuração existente
router.put('/:id', authorizeOwner, emailConfigController.updateConfig);

// Deletar configuração (opcional)
router.delete('/delete/:id', authorizeOwner, emailConfigController.deleteConfig);

module.exports = router;
