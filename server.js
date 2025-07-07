const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => { // <--- Adicione '0.0.0.0' aqui
    console.log(`Server running on port ${PORT}`);
});
    })
    .catch(err => console.error('MongoDB connection error:', err));