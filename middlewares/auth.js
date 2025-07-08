// thermocert-api/middlewares/auth.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // Obter o token do cabeçalho de autorização (formato: "Bearer SEUTOKEN")
    const tokenHeader = req.headers['authorization'];

    // Verificar se o cabeçalho de autorização foi fornecido
    if (!tokenHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Extrair o token removendo "Bearer "
    const token = tokenHeader.split(' ')[1]; // Espera "Bearer TOKEN_AQUI"

    // Se por algum motivo não for "Bearer ", ou se estiver vazio após o split
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Erros comuns: JsonWebTokenError (token inválido), TokenExpiredError (token expirado)
            return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
        }
        // req.user conterá o payload do token (ex: { id: user._id, isAdmin: user.isAdmin })
        req.user = decoded.user; // Certifique-se de que o payload do token JWT está em { user: { id, isAdmin } }
        next();
    });
};

exports.requireAdmin = (req, res, next) => {
    // req.user é definido por verifyToken. Certifique-se de que req.user e req.user.isAdmin existem.
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};