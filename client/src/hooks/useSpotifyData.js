// client/src/hooks/useSpotifyData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useSpotifyData = (accessToken) => {
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [audioFeatures, setAudioFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        // 1. Get Top Tracks
        const tracksRes = await axios.get('http://localhost:5000/spotify/top-tracks', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setTopTracks(tracksRes.data);

        const trackIds = tracksRes.data.map((track) => track.id);

        // 2. Get Audio Features
        const featuresRes = await axios.post(
          'http://localhost:5000/spotify/audio-features',
          { trackIds },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setAudioFeatures(featuresRes.data);

        // 3. Get Top Artists
        const artistsRes = await axios.get('http://localhost:5000/spotify/top-artists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setTopArtists(artistsRes.data);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch Spotify data:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  return {
    topTracks,
    topArtists,
    audioFeatures,
    loading,
  };
};

export default useSpotifyData;
