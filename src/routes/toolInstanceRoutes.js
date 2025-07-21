// src/routes/toolInstanceRoutes.js
const express = require('express');
const router = express.Router();
const toolInstanceController = require('../controllers/toolInstanceController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', toolInstanceController.index);
router.get('/project/:projectId', toolInstanceController.index); // listar ferramentas do projeto
router.get('/project/getLink/:projectId', toolInstanceController.getToolByIdProject); // obter ferramentas por ID do projeto
router.post('/', toolInstanceController.create); // criar ferramenta
router.get('/:id', toolInstanceController.show);
router.put('/:id', toolInstanceController.update); // atualizar ferramenta
router.delete('/:id', toolInstanceController.delete); // deletar ferramenta
router.get('/:id/data', toolInstanceController.readJson);    // ler JSON
router.delete('/:id/data', toolInstanceController.deleteJson);

module.exports = router; 
