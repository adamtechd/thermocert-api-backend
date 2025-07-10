// thermocert-api/middlewares/auth.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = tokenHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token', error: err.message });
        }
        req.user = decoded.user; 
        next();
    });
};

exports.requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};