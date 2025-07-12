// thermocert-api/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.register);

router.get('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.getUsers);

router.patch('/:id/status', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.toggleUserStatus);

router.patch('/:id/permissions', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.updateUserPermissions);

module.exports = router;