// server/services/playlistService.js

const axios = require('axios');

// Create playlist and add mutual + recommended tracks
const createSharedPlaylist = async (accessToken, userId, data) => {
  const { mutualTrackIds, seedArtistIds, seedTrackIds, vibeScore } = data;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // 1. Create the playlist
  const playlistRes = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name: generatePlaylistName(vibeScore),
      description: `Curated by JamCheck – a blend of mutual vibe 🎶`,
      public: false,
    },
    { headers }
  );

  const playlistId = playlistRes.data.id;

  // 2. Get recommended tracks
  const recRes = await axios.get(
    `https://api.spotify.com/v1/recommendations`,
    {
      headers,
      params: {
        limit: 20,
        seed_artists: seedArtistIds.slice(0, 2).join(','),
        seed_tracks: seedTrackIds.slice(0, 3).join(','),
      },
    }
  );

  const recommendedTrackUris = recRes.data.tracks.map((t) => t.uri);
  const mutualTrackUris = mutualTrackIds.map((id) => `spotify:track:${id}`);

  const finalUris = [...mutualTrackUris, ...recommendedTrackUris];

  // 3. Add all tracks to the playlist
  await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    { uris: finalUris },
    { headers }
  );

  return {
    playlistId,
    playlistUrl: playlistRes.data.external_urls.spotify,
    name: playlistRes.data.name,
  };
};

// Fun playlist name generator
const generatePlaylistName = (score) => {
  const base = score >= 80
    ? 'Certified Jam 🔥'
    : score >= 60
    ? 'Pretty In Sync 🎧'
    : score >= 40
    ? 'Hit or Miss Mix 🤔'
    : 'Chaotic Collab 💥';

  const suffixes = ['Vol. 1', 'Roadtrip Edition', 'After Hours', 'Vibe Check'];
  const rand = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${base} · ${rand}`;
};

module.exports = {
  createSharedPlaylist,
};
