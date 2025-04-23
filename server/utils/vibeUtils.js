// server/utils/vibeUtils.js

/**
 * Utility to compare two users' Spotify data and calculate vibe score.
 * Also generates a music persona for each user based on their audio features.
 */

// Helper: Calculate similarity percentage between two arrays
const calcOverlapScore = (arr1, arr2) => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter((item) => set2.has(item)));
    return (intersection.size / Math.max(set1.size, set2.size)) * 100;
  };
  
  // Helper: Average audio features across tracks
  const averageAudioFeatures = (audioFeatures) => {
    const totals = {
      energy: 0,
      valence: 0,
      danceability: 0,
      acousticness: 0,
    };
    const count = audioFeatures.length;
  
    audioFeatures.forEach((track) => {
      totals.energy += track.energy;
      totals.valence += track.valence;
      totals.danceability += track.danceability;
      totals.acousticness += track.acousticness;
    });
  
    return {
      energy: totals.energy / count,
      valence: totals.valence / count,
      danceability: totals.danceability / count,
      acousticness: totals.acousticness / count,
    };
  };
  
  // Persona generator based on averaged audio features
  const getPersona = (avgFeatures) => {
    const { energy, valence, danceability, acousticness } = avgFeatures;
  
    if (energy > 0.7 && valence > 0.6 && danceability > 0.7)
      return 'Hype Beast 🎧 – Lives for beats and high-energy vibes';
    if (acousticness > 0.6 && valence < 0.5)
      return 'Indie Soul 🌿 – Mellow, moody, and loves calm melodies';
    if (danceability > 0.8 && energy > 0.5)
      return 'Groove Machine 🕺 – Born for dance floors and bass drops';
    if (valence < 0.4 && acousticness > 0.5)
      return 'Sad Boi/Aesthetic Girl 🌧️ – Feels all the feelings deeply';
    return 'Balanced Listener 🎵 – Versatile and mood-adaptive';
  };
  
  // Main function: Calculate vibe score + personas
  const analyzeVibe = (userA, userB) => {
    const artistScore = calcOverlapScore(
      userA.topArtists.map((a) => a.id),
      userB.topArtists.map((a) => a.id)
    );
  
    const trackScore = calcOverlapScore(
      userA.topTracks.map((t) => t.id),
      userB.topTracks.map((t) => t.id)
    );
  
    const genreScore = calcOverlapScore(
      userA.topArtists.flatMap((a) => a.genres),
      userB.topArtists.flatMap((a) => a.genres)
    );
  
    const avgA = averageAudioFeatures(userA.audioFeatures);
    const avgB = averageAudioFeatures(userB.audioFeatures);
  
    const audioFeatureDiff = Math.abs(avgA.energy - avgB.energy) +
      Math.abs(avgA.valence - avgB.valence) +
      Math.abs(avgA.danceability - avgB.danceability);
  
    const audioScore = (1 - audioFeatureDiff / 3) * 100;
  
    const finalScore = Math.round((artistScore + trackScore + genreScore + audioScore) / 4);
  
    return {
      compatibilityScore: finalScore,
      scores: {
        artistScore: Math.round(artistScore),
        trackScore: Math.round(trackScore),
        genreScore: Math.round(genreScore),
        audioScore: Math.round(audioScore),
      },
      userAPersona: getPersona(avgA),
      userBPersona: getPersona(avgB),
    };
  };
  
  module.exports = {
    analyzeVibe,
  };
  