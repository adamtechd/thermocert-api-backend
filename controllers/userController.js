// thermocert-api/controllers/userController.js
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password, name } = req.body; 
    try {
        let user = await User.findOne({ email }); 
        if (user) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ 
            username: username || email, 
            email,
            password: hashedPassword, 
            name, 
            isAdmin: false, 
            permissions: { 
                canEdit: false,
                canGeneratePdf: false,
                canGenerateDocx: false,
                canGenerateExcel: false,
                canAccessAdmin: false, 
                isTestMode: true,
            }
        }); 
        await user.save();
        res.status(201).json({ 
            message: 'Usuário criado com sucesso! Modo de teste ativado.', 
            user: { 
                _id: user._id, 
                username: user.username, 
                email: user.email,
                name: user.name, 
                isActive: user.isActive, 
                isAdmin: user.isAdmin,
                permissions: user.permissions
            } 
        });
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({ message: 'Erro ao criar usuário: ' + err.message }); 
    }
};

exports.login = async (req, res) => {
    const { loginIdentifier, password } = req.body; 
    
    try {
        let user = await User.findOne({ username: loginIdentifier });
        if (!user) {
            user = await User.findOne({ email: loginIdentifier });
        }

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
                email: user.email,
                name: user.name,
                isActive: user.isActive,
                isAdmin: user.isAdmin,
                permissions: user.permissions 
            } 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ 
            token, 
            user: { 
                _id: user._id, 
                username: user.username, 
                email: user.email,
                name: user.name, 
                isActive: user.isActive, 
                isAdmin: user.isAdmin,
                permissions: user.permissions
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
            email: user.email, 
            name: user.name, 
            isActive: user.isActive, 
            isAdmin: user.isAdmin,
            permissions: user.permissions 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro ao buscar dados do usuário: ' + err.message });
    }
};

exports.updateUserPermissions = async (req, res) => {
    const { id } = req.params;
    const { permission, value } = req.body; 

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const allowedPermissions = [
            'canEdit', 'canGeneratePdf', 'canGenerateDocx', 'canGenerateExcel', 'isTestMode', 'canAccessAdmin'
        ];

        if (!allowedPermissions.includes(permission) || typeof value !== 'boolean') {
            return res.status(400).json({ message: 'Permissão ou valor inválido.' });
        }

        if (req.user.id === String(user._id) && (permission === 'isAdmin' || permission === 'canAccessAdmin')) {
            return res.status(403).json({ message: 'Você não pode alterar seu próprio status de administrador ou acesso ao painel.' });
        }

        if (permission === 'isAdmin') {
            user.isAdmin = value;
        } else {
            user.permissions = user.permissions || {}; 
            user.permissions[permission] = value;
        }
        
        await user.save();
        res.json({ message: `Permissão '${permission}' de '${user.name}' atualizada para ${value}.`, user });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro ao atualizar permissões do usuário: ' + err.message });
    }
};