const express = require('express');
const router = express.Router();
const controller = require('../controllers/groupParticipantController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.post('/', controller.addParticipant);
router.get('/:groupId', controller.listParticipants);

module.exports = router;
