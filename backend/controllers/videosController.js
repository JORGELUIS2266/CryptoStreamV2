//backend/controllers/videosController.js

const StellarSdk = require('stellar-sdk');
const { videos, rewards } = require('../models/videoModel');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

exports.addVideo = async (req, res) => {
    const { url, ownerPublicKey } = req.body;

    const newId = videos.length + 1;
    videos.push({ id: newId, url, owner: ownerPublicKey });

    // Dar recompensa: simulamos con 10 XLM
    rewards[ownerPublicKey] = (rewards[ownerPublicKey] || 0) + 10;

    res.json({ message: 'Video agregado', video: { id: newId, url, owner: ownerPublicKey }, reward: rewards[ownerPublicKey] });
};

exports.getVideos = async (req, res) => {
    res.json(videos);
};

exports.getRewards = async (req, res) => {
    const { ownerPublicKey } = req.query;
    res.json({ reward: rewards[ownerPublicKey] || 0 });
};
