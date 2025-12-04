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
        required: true
    },
    ipfsHash: String,
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
        required: true
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

// Auto-increment ID logic could be handled here or in controller.
// For simplicity and migration, we'll handle ID generation in the controller
// by finding the max ID + 1.

module.exports = mongoose.model('Video', VideoSchema);
