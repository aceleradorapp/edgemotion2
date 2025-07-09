// src/routes/projectParticipantRoutes.js
const express = require('express');
const router = express.Router();
const projectParticipantController = require('../controllers/projectParticipantController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, projectParticipantController.create);
router.get('/project/:projectId', authenticateToken, projectParticipantController.listByProject);
router.get('/projec-user/:userId', authenticateToken, projectParticipantController.listByUser);
router.put('/:id/status', authenticateToken, projectParticipantController.updateStatus);
router.delete('/:id/delete', authenticateToken, projectParticipantController.remove);
router.get('/token/:token', projectParticipantController.getByToken); // rota pública

module.exports = router;
