const express = require('express');
const router = express.Router();
const EmailService = require('../services/EmailService');
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.me);
router.get('/verify-email', authController.verifyEmail);


module.exports = router;
