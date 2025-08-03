const express = require('express');
const router = express.Router();
const packageController = require('../controllers/PackageController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeOwner = require('../middlewares/authorizeOwner');

// Lista os diretórios dentro de uploads/packages
router.get('/packages/directories', authenticateToken, authorizeOwner, packageController.listDirectories);
router.post('/packages/package-json', authenticateToken, authorizeOwner, packageController.getPackageJson);
router.post('/packages/save-package-json', authenticateToken, authorizeOwner, packageController.savePackageJson);


module.exports = router;
