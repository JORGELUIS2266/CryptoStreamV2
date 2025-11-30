// backend/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PinataService = require('./services/pinataService');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Configurar Pinata
const pinataService = new PinataService(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_KEY
);

// Verificar conexión con Pinata al iniciar
pinataService.testAuthentication()
    .then(() => console.log('✅ Pinata configurado correctamente'))
    .catch(err => console.error('⚠️ Error con Pinata:', err.message));

// Directorio temporal para uploads
const uploadDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configurar Multer para almacenamiento temporal
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Límite de 100MB
    },
    fileFilter: (req, file, cb) => {
        // Aceptar solo videos
        const allowedTypes = /mp4|avi|mov|wmv|flv|webm|mkv/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de video'));
        }
    }
});

// Endpoint de subida a IPFS
app.post('/api/upload', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        console.log('📤 Subiendo archivo a IPFS:', req.file.originalname);

        // Subir a Pinata (IPFS)
        const result = await pinataService.uploadFile(
            req.file.path,
            req.file.originalname
        );

        // Eliminar archivo temporal
        fs.unlinkSync(req.file.path);

        console.log('✅ Archivo subido exitosamente a IPFS');

        res.json({
            success: true,
            url: result.ipfsUrl,
            ipfsHash: result.ipfsHash,
            size: result.size,
            filename: req.file.originalname
        });

    } catch (error) {
        console.error('❌ Error en upload:', error);

        // Limpiar archivo temporal si existe
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            error: 'Error al subir archivo',
            message: error.message
        });
    }
});

// Endpoint para obtener estadísticas de Pinata
app.get('/api/ipfs/stats', async (req, res) => {
    try {
        const usage = await pinataService.getUsage();
        res.json(usage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas de videos
const videoRoutes = require('./routes/videos');
app.use('/api/videos', videoRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📹 Endpoint de upload: http://localhost:${PORT}/api/upload`);
    console.log(`🎬 API de videos: http://localhost:${PORT}/api/videos`);
});
