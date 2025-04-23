// server/routes/authRoutes.js

const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const router = express.Router();

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  FRONTEND_URI,
} = process.env;

// Step 1: Redirect to Spotify login
router.get('/login', (req, res) => {
  const scope = [
    'user-top-read',
    'user-read-email',
    'user-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
  ].join(' ');

  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: generateRandomString(16),
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Step 2: Handle callback from Spotify
router.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const error = req.query.error;

  if (error) {
    return res.redirect(`${FRONTEND_URI}/error?message=${error}`);
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Redirect back to frontend with tokens in query (temp method)
    res.redirect(
      `${FRONTEND_URI}/dashboard?${querystring.stringify({
        access_token,
        refresh_token,
        expires_in,
      })}`
    );
  } catch (err) {
    console.error('Error exchanging token:', err);
    res.redirect(`${FRONTEND_URI}/error?message=token_exchange_failed`);
  }
});

// Helper: Generate random state string
function generateRandomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return result;
}

module.exports = router;
