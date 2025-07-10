// thermocert-api/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.post('/login', userController.login);

router.get('/me', authMiddleware.verifyToken, userController.getMe); 

module.exports = router;