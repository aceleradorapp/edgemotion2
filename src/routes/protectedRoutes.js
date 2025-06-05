// src/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');

router.get(
  '/admin-area',
  authenticateToken,
  authorize({ allowedUserTypes: [1], allowedProfiles: [1] }),
  (req, res) => {
    res.json({ message: 'Área administrativa acessada com sucesso' });
  }
);

router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Acesso autorizado ao dashboard!',
    user: req.user
  });
});

module.exports = router;
