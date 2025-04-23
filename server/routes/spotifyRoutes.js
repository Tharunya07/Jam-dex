// server/routes/spotifyRoutes.js

const express = require('express');
const {
  getUserProfile,
  getTopTracks,
  getTopArtists,
  getAudioFeatures,
} = require('../services/spotifyService');

const router = express.Router();

// Middleware to extract bearer token
const withAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  req.token = token;
  next();
};

// GET /spotify/profile
router.get('/profile', withAuth, async (req, res) => {
  try {
    const profile = await getUserProfile(req.token);
    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// GET /spotify/top-tracks
router.get('/top-tracks', withAuth, async (req, res) => {
  try {
    const tracks = await getTopTracks(req.token);
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching top tracks:', err);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

// GET /spotify/top-artists
router.get('/top-artists', withAuth, async (req, res) => {
  try {
    const artists = await getTopArtists(req.token);
    res.json(artists);
  } catch (err) {
    console.error('Error fetching top artists:', err);
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
});

// POST /spotify/audio-features
router.post('/audio-features', withAuth, async (req, res) => {
  try {
    const { trackIds } = req.body;
    const features = await getAudioFeatures(req.token, trackIds);
    res.json(features);
  } catch (err) {
    console.error('Error fetching audio features:', err);
    res.status(500).json({ error: 'Failed to fetch audio features' });
  }
});

module.exports = router;
