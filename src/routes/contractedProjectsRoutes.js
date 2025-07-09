// src/routes/contractedProjectsRoutes.js
const express = require('express');
const router = express.Router();
const contractedProjectsController = require('../controllers/contractedProjectsController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken);

router.get('/', contractedProjectsController.index);
router.get('/:id', contractedProjectsController.show);
router.get('/user/:userId', contractedProjectsController.listByUser);
router.post('/', contractedProjectsController.create); 
router.put('/:id', contractedProjectsController.update);
router.delete('/:id', contractedProjectsController.delete);

module.exports = router;
