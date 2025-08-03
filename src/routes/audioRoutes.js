// src/routes/audioRoutes.js
const express = require('express');
const router = express.Router();
const audioController = require('../controllers/AudioController');
const authenticateToken = require('../middlewares/authMiddleware');

// Retorna audios.json de uma pasta
router.get('/packages/audio-files/:folderName', authenticateToken, audioController.getAudioList);

// Gera entrada de áudio simulada
router.post('/audio/generate', authenticateToken, audioController.generateAudio);

// Remove entrada e arquivo de áudio
router.delete('/audio/delete', authenticateToken, audioController.deleteAudio);

module.exports = router;