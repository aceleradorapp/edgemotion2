// src/routes/userTypeRoutes.js
const express = require('express');
const router = express.Router();
const userTypeController = require('../controllers/userTypeController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', userTypeController.index);
router.get('/:id', userTypeController.show);
router.post('/', userTypeController.create);
router.put('/:id', userTypeController.update);
router.delete('/:id', userTypeController.delete);

module.exports = router;
