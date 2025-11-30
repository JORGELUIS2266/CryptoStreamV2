// backend/controllers/videosController.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Helper para leer DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            return { videos: [], rewards: {} };
        }
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo DB:', error);
        return { videos: [], rewards: {} };
    }
};

// Helper para escribir DB
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error escribiendo DB:', error);
    }
};

exports.getVideos = async (req, res) => {
    const db = readDB();
    res.json(db.videos);
};

exports.addVideo = async (req, res) => {
    try {
        const {
            title,
            url,
            category,
            reward,
            emoji,
            isReel,
            ownerPublicKey,
            ipfsHash,
            duration
        } = req.body;

        if (!url || !ownerPublicKey) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const db = readDB();

        const newVideo = {
            id: Date.now(), // ID único basado en timestamp
            title: title || 'Sin título',
            url,
            category: category || 'General',
            reward: parseFloat(reward) || 0,
            emoji: emoji || '🎬',
            isReel: !!isReel,
            owner: ownerPublicKey,
            ipfsHash: ipfsHash || '',
            duration: duration || 0,
            createdAt: new Date().toISOString()
        };

        db.videos.push(newVideo);

        // Recompensa por subir video (opcional)
        // db.rewards[ownerPublicKey] = (db.rewards[ownerPublicKey] || 0) + 10;

        writeDB(db);

        console.log('✅ Nuevo video guardado:', newVideo.title);
        res.json({ message: 'Video agregado exitosamente', video: newVideo });

    } catch (error) {
        console.error('Error en addVideo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const db = readDB();

        const initialLength = db.videos.length;
        db.videos = db.videos.filter(v => v.id.toString() !== id.toString());

        if (db.videos.length === initialLength) {
            return res.status(404).json({ error: 'Video no encontrado' });
        }

        writeDB(db);
        console.log(`🗑️ Video ${id} eliminado`);
        res.json({ message: 'Video eliminado' });

    } catch (error) {
        console.error('Error en deleteVideo:', error);
        res.status(500).json({ error: 'Error al eliminar video' });
    }
};

exports.getRewards = async (req, res) => {
    const { ownerPublicKey } = req.query;
    const db = readDB();
    res.json({ reward: db.rewards[ownerPublicKey] || 0 });
};
