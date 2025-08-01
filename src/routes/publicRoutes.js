const express = require('express');
const router = express.Router();
const PublicEmailController = require('../controllers/PublicEmailController');

router.post('/contact', PublicEmailController.sendContactEmail);

module.exports = router;
