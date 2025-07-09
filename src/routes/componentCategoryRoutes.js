const express = require('express');
const router = express.Router();
const controller = require('../controllers/componentCategoryController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', controller.index);
router.get('/listCategory', controller.listCategory);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
