// thermocert-api/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Certifique-se que está importado

dotenv.config();
const app = express();

app.use(cors({
    origin: 'https://thermoquali-pro-frontend.vercel.app', // SUA URL FRONTAL DA VERCEL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 

// --- CORREÇÃO AQUI ---
// Monte authRoutes em /api/auth
app.use('/api/auth', authRoutes); 
// Monte userRoutes em /api/users
app.use('/api/users', userRoutes); 
// --- FIM DA CORREÇÃO ---

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => { 
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));