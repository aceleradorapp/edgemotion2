// src/routes/sharedLinkRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/sharedLinkController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, controller.create);
router.get('/:code', controller.getByCode); // acesso público

module.exports = router;
