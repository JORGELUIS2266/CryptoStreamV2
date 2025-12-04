const Video = require('../models/Video');

// Obtener todos los videos
exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        // Mapear para asegurar compatibilidad con el frontend (owner vs ownerPublicKey)
        const formattedVideos = videos.map(v => ({
            ...v.toObject(),
            owner: v.ownerPublicKey // Frontend espera 'owner'
        }));
        res.json(formattedVideos);
    } catch (error) {
        console.error('Error getVideos:', error);
        res.status(500).json({ error: 'Error al obtener videos' });
    }
};

// Agregar un nuevo video
exports.addVideo = async (req, res) => {
    try {
        const { title, url, ipfsHash, category, reward, emoji, isReel, ownerPublicKey, duration } = req.body;

        if (!url || !ownerPublicKey) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        // Generar ID numérico simple (timestamp) para compatibilidad
        const newId = Date.now();

        const newVideo = await Video.create({
            id: newId,
            title: title || 'Sin título',
            url,
            ipfsHash,
            category: category || 'General',
            reward: parseFloat(reward) || 0,
            emoji: emoji || '🎬',
            isReel: !!isReel,
            ownerPublicKey,
            duration: duration || 0
        });

        console.log('✅ Nuevo video guardado en MongoDB:', newVideo.title);

        // Devolver formato esperado por frontend
        const responseVideo = {
            ...newVideo.toObject(),
            owner: newVideo.ownerPublicKey
        };

        res.status(201).json(responseVideo);
    } catch (error) {
        console.error('Error al guardar video:', error);
        res.status(500).json({ error: 'Error al guardar video en base de datos' });
    }
};

// Eliminar un video
exports.deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const result = await Video.findOneAndDelete({ id: videoId });

        if (!result) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        console.log(`🗑️ Video ${videoId} eliminado de MongoDB`);
        res.json({ success: true, message: 'Video eliminado' });
    } catch (error) {
        console.error('Error deleteVideo:', error);
        res.status(500).json({ error: 'Error al eliminar video' });
    }
};

// Obtener recompensas (Placeholder para compatibilidad)
exports.getRewards = async (req, res) => {
    // Por ahora retornamos 0, se puede implementar modelo de Usuario/Rewards luego
    res.json({ reward: 0 });
};
