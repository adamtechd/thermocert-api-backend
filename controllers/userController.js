// thermocert-api/controllers/userController.js
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função de Registro de Novo Usuário
exports.register = async (req, res) => {
    // Adicionado 'name' aqui, que é esperado pelo seu modelo User
    const { username, password, name, isAdmin } = req.body; 
    try {
        // Verifica se o usuário já existe
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Nome de usuário já existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Garante que 'name' é passado e 'isAdmin' tem um valor padrão de false
        user = new User({ username, password: hashedPassword, name, isAdmin: isAdmin || false }); 
        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso', user: { _id: user._id, username: user.username, name: user.name, isActive: user.isActive, isAdmin: user.isAdmin } });
    } catch (err) {
        console.error(err.message); // Log mais detalhado do erro
        res.status(500).json({ message: 'Erro ao criar usuário: ' + err.message }); // Mensagem mais amigável
    }
};

// Função de Login
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
        
        // Payload do JWT agora inclui mais dados do usuário, conforme o frontend espera
        const payload = { 
            user: { 
                id: user._id, // Usar _id do MongoDB
                username: user.username,
                name: user.name,
                isActive: user.isActive,
                isAdmin: user.isAdmin 
            } 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        // Retorna o token e os dados COMPLETO do usuário, conforme o frontend espera
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
        console.error(err.message); // Log mais detalhado do erro
        res.status(500).json({ message: 'Erro de login: ' + err.message });
    }
};

// Função para Listar Todos os Usuários
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').select('-__v'); // Exclui o campo '__v' também
        res.json(users);
    } catch (err) {
        console.error(err.message); // Log mais detalhado do erro
        res.status(500).json({ message: 'Erro ao buscar usuários: ' + err.message });
    }
};

// Função para Ativar/Desativar Status do Usuário
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        // Previne que um administrador tente desativar a si mesmo
        // req.user.id vem do payload do token JWT, definido pelo middleware 'auth'
        if (req.user.id === String(user._id) && user.isAdmin) { // Converte user._id para string para comparação
            return res.status(403).json({ message: 'Você não pode desativar seu próprio usuário administrador.' });
        }

        user.isActive = !user.isActive;
        await user.save();
        res.json({ message: `Status do usuário ${user.name} atualizado para ${user.isActive ? 'ativo' : 'inativo'}`, user });
    } catch (err) {
        console.error(err.message); // Log mais detalhado do erro
        res.status(500).json({ message: 'Erro ao atualizar status do usuário: ' + err.message });
    }
};

// NOVO: Função para obter os dados do usuário logado (usada por /api/auth/me)
// req.user é definido pelo middleware verifyToken, que contém o payload do token
exports.getMe = async (req, res) => {
    try {
        // req.user.id contém o _id do usuário do MongoDB, vindo do payload do token.
        // O select('-password') garante que a senha nunca seja retornada.
        const user = await User.findById(req.user.id).select('-password -__v'); // Exclui também __v
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        // Retorna os dados do usuário de forma consistente com o payload de login
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