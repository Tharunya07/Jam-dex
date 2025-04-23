import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSpotifyData from '../hooks/useSpotifyData';
import { analyzeVibe } from '../utils/analyzeVibe';

const [userBJoined, setUserBJoined] = useState(false);
const [vibeResult, setVibeResult] = useState(null);

const [playlistInfo, setPlaylistInfo] = useState(null);
const [isGenerating, setIsGenerating] = useState(false);


useEffect(() => {
    if (topTracks.length && topArtists.length && audioFeatures.length) {
      // If user came via invite, flag as user B
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('invite')) setUserBJoined(true);
    }
  }, [topTracks]);
  
  const handleVibeCheck = () => {
    const storedUserA = JSON.parse(localStorage.getItem('jamcheck_userA'));
  
    const userA = {
      topTracks: storedUserA.topTracks,
      topArtists: storedUserA.topArtists,
      audioFeatures: storedUserA.audioFeatures,
    };
  
    const userB = {
      topTracks,
      topArtists,
      audioFeatures,
    };
  
    const result = analyzeVibe(userA, userB);
    setVibeResult(result);
  };
  
  const handleGeneratePlaylist = async () => {
    setIsGenerating(true);
  
    const storedUserA = JSON.parse(localStorage.getItem('jamcheck_userA'));
  
    // Get mutual track overlap
    const mutualTrackIds = storedUserA.topTracks
      .filter((trackA) => topTracks.find((trackB) => trackB.id === trackA.id))
      .map((t) => t.id);
  
    // Pick top artist/track seeds
    const seedArtistIds = storedUserA.topArtists
      .slice(0, 2)
      .map((a) => a.id)
      .concat(topArtists.slice(0, 2).map((a) => a.id));
  
    const seedTrackIds = storedUserA.topTracks
      .slice(0, 2)
      .map((t) => t.id)
      .concat(topTracks.slice(0, 2).map((t) => t.id));
  
    try {
      const res = await axios.post(
        'http://localhost:5000/playlist/generate',
        {
          mutualTrackIds,
          seedArtistIds,
          seedTrackIds,
          vibeScore: vibeResult.compatibilityScore,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      setPlaylistInfo(res.data);
    } catch (err) {
      console.error('Failed to generate playlist:', err);
      alert('Something went wrong generating the playlist.');
    }
  
    setIsGenerating(false);
  };

  
  
  const handleSaveUserA = () => {
    localStorage.setItem(
      'jamcheck_userA',
      JSON.stringify({ topTracks, topArtists, audioFeatures })
    );
    alert('Data saved! Share your invite link.');
  };

function Dashboard() {
  const [accessToken, setAccessToken] = useState('');
  const [profile, setProfile] = useState(null);

  // Extract token from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      localStorage.setItem('jamcheck_token', token);
    } else {
      const saved = localStorage.getItem('jamcheck_token');
      if (saved) setAccessToken(saved);
    }
  }, []);

  const { topTracks, topArtists, audioFeatures, loading } = useSpotifyData(accessToken);

  useEffect(() => {
    if (!accessToken) return;
    axios
      .get('http://localhost:5000/spotify/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [accessToken]);

  const handleCopyInvite = () => {
    const link = `${window.location.origin}/dashboard?invite=true`;
    navigator.clipboard.writeText(link);
    alert('Invite link copied to clipboard!');
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">🎶 Welcome to JamCheck</h1>

      {profile ? (
        <div>
          <h2 className="text-xl mb-2">Logged in as: {profile.display_name}</h2>
          <img
            src={profile.images[0]?.url}
            alt="Profile"
            className="rounded-full w-28 h-28 mx-auto"
          />
          <p className="text-sm text-gray-600 mt-2">Followers: {profile.followers.total}</p>

          <div className="mt-6">
            {loading ? (
              <p className="text-gray-600">Loading your vibe data...</p>
            ) : (
              <>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleCopyInvite}
                >
                  Invite a Friend to Jam 🔗
                </button>

                <p className="text-sm text-gray-500 mt-2">
                  Share the link and vibe check your compatibility!
                </p>
              </>
            )}
          </div>
          {!userBJoined && (
  <button
    onClick={handleSaveUserA}
    className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
  >
    Save My Data (User A)
  </button>
)}

{userBJoined && (
  <button
    onClick={handleVibeCheck}
    className="mt-6 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
  >
    Run Vibe Comparison 💫
  </button>
)}

{vibeResult && (
  <div className="mt-10 bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-bold mb-2">🎯 Vibe Match Score: {vibeResult.compatibilityScore}%</h3>
    <p className="mb-4 text-sm text-gray-600">
      You two are {vibeResult.compatibilityScore >= 80 ? 'a certified jam duo 🔥' :
        vibeResult.compatibilityScore >= 60 ? 'pretty musically in-sync 🎧' :
        'definitely eclectic 💥'}
    </p>
    <div className="flex justify-around text-left">
      <div>
        <h4 className="font-semibold mb-1">You: {vibeResult.userAPersona}</h4>
        <h4 className="font-semibold">Them: {vibeResult.userBPersona}</h4>
      </div>
      <div>
        <p className="text-sm">Artist Match: {vibeResult.scores.artistScore}%</p>
        <p className="text-sm">Track Match: {vibeResult.scores.trackScore}%</p>
        <p className="text-sm">Genre Match: {vibeResult.scores.genreScore}%</p>
        <p className="text-sm">Vibe Alignment: {vibeResult.scores.audioScore}%</p>
      </div>
    </div>
  </div>
)}

{vibeResult && !playlistInfo && (
  <button
    onClick={handleGeneratePlaylist}
    disabled={isGenerating}
    className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
  >
    {isGenerating ? 'Generating...' : 'Generate Shared Playlist 🎶'}
  </button>
)}

{playlistInfo && (
  <div className="mt-6 text-center">
    <h3 className="text-lg font-bold">✅ Playlist Created!</h3>
    <p className="mb-2">{playlistInfo.name}</p>
    <a
      href={playlistInfo.playlistUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
    >
      Open on Spotify
    </a>
  </div>
)}


        </div>
      ) : (
        <p className="text-gray-600">Loading your profile...</p>
      )}
    </div>
  );
}

export default Dashboard;
