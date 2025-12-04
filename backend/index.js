// backend/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors({
    origin: '*', // Permitir todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'CryptoStream Server is running 🚀',
        timestamp: new Date().toISOString()
    });
});

// Rutas de videos
const videoRoutes = require('./routes/videos');
app.use('/api/videos', videoRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🎬 API de videos: http://localhost:${PORT}/api/videos`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
