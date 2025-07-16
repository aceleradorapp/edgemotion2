const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeOwner = require('../middlewares/authorizeOwner');

router.use(authenticateToken);

router.post('/', authorizeOwner, menuItemController.create);
router.get('/', authorizeOwner, menuItemController.listAll);
router.put('/:id', authorizeOwner, menuItemController.update);
router.delete('/delete/:id', authorizeOwner, menuItemController.delete);
router.get('/filters', menuItemController.listAllFilter);

module.exports = router;
