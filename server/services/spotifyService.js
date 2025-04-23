// server/services/spotifyService.js

const axios = require('axios');

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Fetch user profile
const getUserProfile = async (accessToken) => {
  const response = await axios.get(`${SPOTIFY_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Fetch top tracks
const getTopTracks = async (accessToken, time_range = 'medium_term') => {
  const response = await axios.get(`${SPOTIFY_API_BASE}/me/top/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { limit: 20, time_range },
  });
  return response.data.items;
};

// Fetch top artists
const getTopArtists = async (accessToken, time_range = 'medium_term') => {
  const response = await axios.get(`${SPOTIFY_API_BASE}/me/top/artists`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { limit: 20, time_range },
  });
  return response.data.items;
};

// Get audio features for a list of track IDs
const getAudioFeatures = async (accessToken, trackIds) => {
  const ids = trackIds.slice(0, 100).join(',');
  const response = await axios.get(`${SPOTIFY_API_BASE}/audio-features`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { ids },
  });
  return response.data.audio_features;
};

module.exports = {
  getUserProfile,
  getTopTracks,
  getTopArtists,
  getAudioFeatures,
};
