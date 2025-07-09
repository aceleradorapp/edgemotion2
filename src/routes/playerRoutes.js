const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/player', authenticateToken, playerController.getPlayer);
router.post('/player/public', playerController.getPlayerPublic);

module.exports = router;
