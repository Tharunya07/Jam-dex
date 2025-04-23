// server/server.js

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const spotifyRoutes = require('./routes/spotifyRoutes');
app.use('/spotify', spotifyRoutes);

const playlistRoutes = require('./routes/playlistRoutes');
app.use('/playlist', playlistRoutes);

app.use(cors()); // Allow requests from frontend
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('JamCheck API is live 🎶');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
