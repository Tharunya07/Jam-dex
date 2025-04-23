// client/src/utils/analyzeVibe.js

export const calcOverlapScore = (arr1, arr2) => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter((item) => set2.has(item)));
    return (intersection.size / Math.max(set1.size, set2.size)) * 100;
  };
  
  export const averageAudioFeatures = (features) => {
    const totals = {
      energy: 0,
      valence: 0,
      danceability: 0,
      acousticness: 0,
    };
    features.forEach((f) => {
      totals.energy += f.energy;
      totals.valence += f.valence;
      totals.danceability += f.danceability;
      totals.acousticness += f.acousticness;
    });
    const count = features.length;
    return {
      energy: totals.energy / count,
      valence: totals.valence / count,
      danceability: totals.danceability / count,
      acousticness: totals.acousticness / count,
    };
  };
  
  export const getPersona = ({ energy, valence, danceability, acousticness }) => {
    if (energy > 0.7 && valence > 0.6 && danceability > 0.7)
      return 'Hype Beast 🎧';
    if (acousticness > 0.6 && valence < 0.5)
      return 'Indie Soul 🌿';
    if (danceability > 0.8 && energy > 0.5)
      return 'Groove Machine 🕺';
    if (valence < 0.4 && acousticness > 0.5)
      return 'Sad Boi/Aesthetic Girl 🌧️';
    return 'Balanced Listener 🎵';
  };
  
  export const analyzeVibe = (userA, userB) => {
    const artistScore = calcOverlapScore(userA.topArtists.map((a) => a.id), userB.topArtists.map((a) => a.id));
    const trackScore = calcOverlapScore(userA.topTracks.map((t) => t.id), userB.topTracks.map((t) => t.id));
    const genreScore = calcOverlapScore(
      userA.topArtists.flatMap((a) => a.genres),
      userB.topArtists.flatMap((a) => a.genres)
    );
  
    const avgA = averageAudioFeatures(userA.audioFeatures);
    const avgB = averageAudioFeatures(userB.audioFeatures);
    const audioDiff =
      Math.abs(avgA.energy - avgB.energy) +
      Math.abs(avgA.valence - avgB.valence) +
      Math.abs(avgA.danceability - avgB.danceability);
  
    const audioScore = (1 - audioDiff / 3) * 100;
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
  