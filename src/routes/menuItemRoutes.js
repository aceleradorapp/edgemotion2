const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeOwner = require('../middlewares/authorizeOwner');

router.use(authenticateToken, authorizeOwner);

router.post('/', menuItemController.create);
router.get('/', menuItemController.listAll);
router.put('/:id', menuItemController.update);
router.delete('/delete/:id', menuItemController.delete);
router.get('/filters', menuItemController.listAllFilter);

module.exports = router;
