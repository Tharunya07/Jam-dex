import React from 'react';

function LandingPage() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/login';
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-400 to-blue-500 text-white text-center">
      <h1 className="text-5xl font-bold mb-4">🎵 JamCheck</h1>
      <p className="mb-8 text-lg">Check your vibe match. Create playlists that hit just right.</p>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black hover:bg-gray-900 text-white rounded-md shadow-md transition"
      >
        Login with Spotify
      </button>
    </div>
  );
}

export default LandingPage;
