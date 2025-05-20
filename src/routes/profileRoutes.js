const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', profileController.index);
router.get('/:id', profileController.show);
router.post('/', profileController.create);
router.put('/:id', profileController.update);
router.delete('/:id', profileController.delete);

module.exports = router;
