// thermocert-api/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// Rota de Login da Aplicação
router.post('/login', userController.login);

// Rota para verificar o usuário logado (para persistência de sessão no frontend)
router.get('/me', authMiddleware.verifyToken, userController.getMe); 

module.exports = router;