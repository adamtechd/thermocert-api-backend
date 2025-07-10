// thermocert-api/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// Rota para Registrar um novo usuário (POST /api/users)
// Protegida: Apenas administradores podem criar usuários após login
router.post('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.register);

// Rota para Listar todos os usuários (GET /api/users)
// Protegida: Apenas administradores podem listar usuários
router.get('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.getUsers);

// Rota para Ativar/Desativar um usuário (PATCH /api/users/:id/status)
// Protegida: Apenas administradores podem alterar o status
router.patch('/:id/status', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.toggleUserStatus);

module.exports = router;