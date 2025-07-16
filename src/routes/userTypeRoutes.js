// src/routes/userTypeRoutes.js
const express = require('express');
const router = express.Router();
const userTypeController = require('../controllers/userTypeController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeOwner = require('../middlewares/authorizeOwner');

router.use(authenticateToken, authorizeOwner);

router.get('/', userTypeController.index);
router.get('/:id', userTypeController.show);
router.post('/', userTypeController.create);
router.put('/:id', userTypeController.update);
router.delete('/:id', userTypeController.delete);

module.exports = router;
