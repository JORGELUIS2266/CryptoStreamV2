
//backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const videoRoutes = require('./routes/videos');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/videos', videoRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
