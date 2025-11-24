//backend/routes/videos.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/videosController.js');

router.post('/add', controller.addVideo);
router.get('/', controller.getVideos);
router.get('/rewards', controller.getRewards);

module.exports = router;
