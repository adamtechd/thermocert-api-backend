// thermocert-api/controllers/userController.js
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, name, isAdmin } = req.body; 
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Nome de usuário já existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword, name, isAdmin: isAdmin || false }); 
        await user.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso', user: { _id: user._id, username: user.username, name: user.name, isActive: user.isActive, isAdmin: user.isAdmin } });
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({ message: 'Erro ao criar usuário: ' + err.message }); 
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: 'Sua conta está desativada. Entre em contato com o administrador.' });
        }
        
        const payload = { 
            user: { 
                id: user._id, 
                username: user.username,
                name: user.name,
                isActive: user.isActive,
                isAdmin: user.isAdmin 
            } 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ 
            token, 
            user: { 
                _id: user._id, 
                username: user.username, 
                name: user.name, 
                isActive: user.isActive, 
                isAdmin: user.isAdmin 
            } 
        });
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({ message: 'Erro de login: ' + err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').select('-__v'); 
        res.json(users);
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({ message: 'Erro ao buscar usuários: ' + err.message });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        if (req.user.id === String(user._id) && user.isAdmin) { 
            return res.status(403).json({ message: 'Você não pode desativar seu próprio usuário administrador.' });
        }

        user.isActive = !user.isActive;
        await user.save();
        res.json({ message: `Status do usuário ${user.name} atualizado para ${user.isActive ? 'ativo' : 'inativo'}`, user });
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({ message: 'Erro ao atualizar status do usuário: ' + err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -__v'); 
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({
            _id: user._id,
            username: user.username,
            name: user.name,
            isActive: user.isActive,
            isAdmin: user.isAdmin
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro ao buscar dados do usuário: ' + err.message });
    }
};