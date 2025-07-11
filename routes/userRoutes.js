// thermocert-api/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth'); 

// POST /api/users
router.post('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.register);

// GET /api/users
router.get('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.getUsers);

// PATCH /api/users/:id/status
router.patch('/:id/status', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.toggleUserStatus);

// PATCH /api/users/:id/permissions
router.patch('/:id/permissions', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.updateUserPermissions);

module.exports = router;