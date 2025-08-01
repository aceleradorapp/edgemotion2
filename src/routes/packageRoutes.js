const express = require('express');
const router = express.Router();
const packageController = require('../controllers/PackageController');
const authenticateToken = require('../middlewares/authMiddleware');

// Lista os diretórios dentro de uploads/packages
router.get('/packages/directories', authenticateToken, packageController.listDirectories);
router.post('/packages/package-json', authenticateToken, packageController.getPackageJson);
router.post('/packages/save-package-json', authenticateToken, packageController.savePackageJson);


module.exports = router;
