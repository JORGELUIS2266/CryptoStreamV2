// backend/controllers/videosController.js
const Video = require('../models/Video');

// Almacenamiento en memoria para desarrollo local (cuando no hay MongoDB)
let memoryVideos = [];

// Helper para verificar si MongoDB está conectado
const isMongoConnected = () => {
    const mongoose = require('mongoose');
    return mongoose.connection.readyState === 1;
};

// Obtener todos los videos
exports.getVideos = async (req, res) => {
    try {
        if (isMongoConnected()) {
            const videos = await Video.find().sort({ createdAt: -1 });
            const formattedVideos = videos.map(v => ({
                ...v.toObject(),
                owner: v.ownerPublicKey
            }));
            res.json(formattedVideos);
        } else {
            // Modo desarrollo - usar memoria
            const formattedVideos = memoryVideos.map(v => ({
                ...v,
                owner: v.ownerPublicKey
            }));
            res.json(formattedVideos);
        }
    } catch (error) {
        console.error('Error getVideos:', error);
        res.status(500).json({ error: 'Error al obtener videos' });
    }
};

// Agregar un nuevo video
exports.addVideo = async (req, res) => {
    try {
        const { title, url, category, reward, emoji, isReel, ownerPublicKey, duration } = req.body;

        if (!url || !ownerPublicKey) {
            return res.status(400).json({ error: 'Faltan datos requeridos (url, ownerPublicKey)' });
        }

        // Validar que la URL sea válida
        try {
            new URL(url);
        } catch (e) {
            return res.status(400).json({ error: 'La URL proporcionada no es válida' });
        }

        // Generar ID numérico simple (timestamp)
        const newId = Date.now();

        const videoData = {
            id: newId,
            title: title || 'Sin título',
            url,
            category: category || 'General',
            reward: parseFloat(reward) || 0,
            emoji: emoji || '🎬',
            isReel: !!isReel,
            ownerPublicKey,
            duration: duration || 0,
            createdAt: new Date()
        };

        if (isMongoConnected()) {
            // Guardar en MongoDB
            const newVideo = await Video.create(videoData);
            console.log('✅ Nuevo video guardado en MongoDB:', newVideo.title);

            const responseVideo = {
                ...newVideo.toObject(),
                owner: newVideo.ownerPublicKey
            };
            res.status(201).json(responseVideo);
        } else {
            // Modo desarrollo - guardar en memoria
            memoryVideos.push(videoData);
            console.log('✅ Nuevo video guardado en memoria:', videoData.title);

            const responseVideo = {
                ...videoData,
                owner: videoData.ownerPublicKey
            };
            res.status(201).json(responseVideo);
        }
    } catch (error) {
        console.error('Error al guardar video:', error);
        res.status(500).json({ error: 'Error al guardar video en base de datos' });
    }
};

// Eliminar un video
exports.deleteVideo = async (req, res) => {
    try {
        const videoId = parseInt(req.params.id);

        if (isMongoConnected()) {
            const result = await Video.findOneAndDelete({ id: videoId });

            if (!result) {
                return res.status(404).json({ error: 'Video no encontrado' });
            }

            console.log(`🗑️ Video ${videoId} eliminado de MongoDB`);
            res.json({ success: true, message: 'Video eliminado' });
        } else {
            // Modo desarrollo - eliminar de memoria
            const index = memoryVideos.findIndex(v => v.id === videoId);

            if (index === -1) {
                return res.status(404).json({ error: 'Video no encontrado' });
            }

            memoryVideos.splice(index, 1);
            console.log(`🗑️ Video ${videoId} eliminado de memoria`);
            res.json({ success: true, message: 'Video eliminado' });
        }
    } catch (error) {
        console.error('Error deleteVideo:', error);
        res.status(500).json({ error: 'Error al eliminar video' });
    }
};

// Obtener recompensas (Placeholder para compatibilidad)
exports.getRewards = async (req, res) => {
    res.json({ reward: 0 });
};
