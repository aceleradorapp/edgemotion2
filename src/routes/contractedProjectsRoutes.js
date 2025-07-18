// src/routes/contractedProjectsRoutes.js
const express = require('express');
const router = express.Router();
const contractedProjectsController = require('../controllers/contractedProjectsController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeOwner = require('../middlewares/authorizeOwner');

router.use(authenticateToken);

router.post('/demo', contractedProjectsController.demoCreate); 

router.get('/', contractedProjectsController.index);
router.get('/:id', contractedProjectsController.show);
router.get('/user/:userId', contractedProjectsController.listByUser);
router.post('/', authorizeOwner, contractedProjectsController.create); 
router.put('/:id', authorizeOwner, contractedProjectsController.update);
router.delete('/:id', authorizeOwner, contractedProjectsController.delete);

module.exports = router;
