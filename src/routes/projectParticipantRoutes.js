// src/routes/projectParticipantRoutes.js
const express = require('express');
const router = express.Router();
const projectParticipantController = require('../controllers/projectParticipantController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, projectParticipantController.create);
router.get('/project/:projectId', authenticateToken, projectParticipantController.listByProject);
router.put('/:id/status', authenticateToken, projectParticipantController.updateStatus);
router.get('/token/:token', projectParticipantController.getByToken); // rota pública

module.exports = router;
