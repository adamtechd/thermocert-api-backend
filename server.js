// thermocert-api/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

const allowedOrigins = [
    'https://thermoquali-pro-frontend.vercel.app', 
    // Adicione outras URLs de preview da Vercel se necessário
    // Ex: 'https://thermoquali-pro-frontend-git-main-adams-projects-09247cef.vercel.app',
    //     'https://thermoquali-pro-frontend-fsnrpo0cr-adams-projects-09247cef.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend ThermoCert Pro está online!');
});

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => { 
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));