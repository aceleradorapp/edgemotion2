const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.post('/', groupController.create);
router.get('/project/:projectId', groupController.listByProject);

module.exports = router;
