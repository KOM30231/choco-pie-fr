export const MOODS = [
  { key: 'chill', emoji: '😌', label: 'Chill', level: 0 },
  { key: 'suspicious', emoji: '🤨', label: 'Suspicious', level: 1 },
  { key: 'annoyed', emoji: '😤', label: 'Annoyed', level: 2 },
  { key: 'dramatic', emoji: '😭', label: 'Dramatic', level: 3 },
  { key: 'unhinged', emoji: '😈', label: 'UNHINGED', level: 4 },
];

// The user's recorded voices are the ONLY spoken audio used by the app.
// Multiple recordings in the same mood are randomly selected for variety.
export const VOICES = {
  chill: ['/audio/chill.m4a'],
  suspicious: ['/audio/suspicious-1.m4a', '/audio/suspicious-2.m4a'],
  annoyed: ['/audio/annoyed-1.m4a', '/audio/annoyed-2.m4a'],
  dramatic: ['/audio/dramatic.m4a'],
  unhinged: ['/audio/unhinged.m4a'],
  final: ['/audio/final.m4a'],
};

export const STOP_REACTIONS = [
  {
    mood: MOODS[1],
    voiceKey: 'suspicious',
    button: '🤨 TRY THAT AGAIN',
  },
  {
    mood: MOODS[2],
    voiceKey: 'annoyed',
    button: '😤 NO, SERIOUSLY, STOP',
  },
  {
    mood: MOODS[3],
    voiceKey: 'dramatic',
    button: '😭 YOU ARE SO MEAN',
  },
  {
    mood: MOODS[4],
    voiceKey: 'unhinged',
    button: '😈 MAKE ME STOP',
  },
];

let activeVoice = null;

function pickVoice(key) {
  const choices = VOICES[key] || [];
  if (!choices.length) return null;
  return choices[Math.floor(Math.random() * choices.length)];
}

/** Play one of the user's recorded voice clips. */
export function playVoice(key, onEnded) {
  stopVoice();
  const src = pickVoice(key);
  if (!src) return false;

  try {
    activeVoice = new Audio(src);
    activeVoice.volume = 1;
    activeVoice.preload = 'auto';
    if (onEnded) activeVoice.addEventListener('ended', onEnded, { once: true });
    const playPromise = activeVoice.play();
    if (playPromise?.catch) {
      playPromise.catch((error) => {
        console.warn('Random Alarm: recorded voice could not play.', error);
        if (onEnded) onEnded();
      });
    }
    return true;
  } catch (error) {
    console.warn('Random Alarm: recorded voice could not play.', error);
    return false;
  }
}

export function stopVoice() {
  if (!activeVoice) return;
  activeVoice.pause();
  activeVoice.currentTime = 0;
  activeVoice = null;
}
