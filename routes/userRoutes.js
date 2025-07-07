const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/users', auth.verifyToken, auth.requireAdmin, userController.register);
router.post('/login', userController.login);
router.get('/users', auth.verifyToken, auth.requireAdmin, userController.getUsers);
router.patch('/users/:id/status', auth.verifyToken, auth.requireAdmin, userController.toggleUserStatus);

module.exports = router;