const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // <--- Adicionado e importado corretamente

dotenv.config();
const app = express();

app.use(cors({
    origin: 'https://thermoquali-pro-frontend.vercel.app', // <--- SUA URL FRONTAL DA VERCEL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // <--- Este DEVE vir ANTES das suas rotas!

// Definição das rotas
app.use('/api/auth', authRoutes); // <--- Rotas de autenticação
app.use('/api/users', userRoutes); // <--- Rotas de gerenciamento de usuários

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => { 
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));