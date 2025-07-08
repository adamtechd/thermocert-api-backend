// thermocert-api/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Importa o controller de usuário
const authMiddleware = require('../middlewares/auth'); // Importa o middleware de auth

// Rota para o Login da Aplicação
// @route   POST /api/auth/login
// @desc    Autenticar usuário e obter token JWT
// @access  Public
router.post('/login', userController.login);

// Rota para verificar o usuário logado (para persistência de sessão no frontend)
// @route   GET /api/auth/me
// @desc    Obter dados do usuário logado (requer token JWT)
// @access  Private
router.get('/me', authMiddleware.verifyToken, userController.getMe); // userController.getMe precisa existir

module.exports = router;