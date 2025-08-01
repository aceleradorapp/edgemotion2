// src/routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');


router.post('/users/company', authenticateToken, userController.register);
router.get('/users/company', authenticateToken, userController.listAllByCompany);
router.put('/users/company/:guid', authenticateToken, userController.update);
router.delete('/users/company/:guid', authenticateToken, userController.delete);
router.get('/users', authenticateToken, userController.listAllUsers);
router.get('/users/:id', authenticateToken, userController.getById);
router.delete('/users/:id', authenticateToken, userController.deleteById);

module.exports = router;
