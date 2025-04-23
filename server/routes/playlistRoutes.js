// server/routes/playlistRoutes.js

const express = require('express');
const { createSharedPlaylist } = require('../services/playlistService');
const { getUserProfile } = require('../services/spotifyService');

const router = express.Router();

// POST /playlist/generate
router.post('/generate', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const {
    mutualTrackIds,
    seedArtistIds,
    seedTrackIds,
    vibeScore,
  } = req.body;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const user = await getUserProfile(token);

    const result = await createSharedPlaylist(token, user.id, {
      mutualTrackIds,
      seedArtistIds,
      seedTrackIds,
      vibeScore,
    });

    res.json(result);
  } catch (err) {
    console.error('Error creating playlist:', err);
    res.status(500).json({ error: 'Failed to generate playlist' });
  }
});

module.exports = router;
