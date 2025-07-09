// src/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken); // protege todas as rotas

router.get('/', projectsController.index);
router.get('/showAll', projectsController.showAll);
router.get('/:id', projectsController.show);
router.post('/', projectsController.create);
router.put('/:id', projectsController.update);
router.delete('/:id', projectsController.delete);

module.exports = router;
