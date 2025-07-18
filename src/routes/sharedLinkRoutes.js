// src/routes/sharedLinkRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sharedLinkController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, controller.create);
router.get('/', controller.getAll);
router.get('/:code', controller.getByCode); // acesso público
router.get('/guid/:guid', controller.getKeywordByGuid);
router.put('/:codeLink/expires-at', authenticateToken, controller.updateExpiresAt);

module.exports = router;
