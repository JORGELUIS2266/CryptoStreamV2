const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    url: {
        type: String,
        required: [true, 'La URL es obligatoria']
    },
    category: {
        type: String,
        default: 'General'
    },
    reward: {
        type: Number,
        default: 0
    },
    emoji: {
        type: String,
        default: '🎬'
    },
    isReel: {
        type: Boolean,
        default: false
    },
    ownerPublicKey: {
        type: String,
        required: [true, 'El propietario es obligatorio']
    },
    duration: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', VideoSchema);
