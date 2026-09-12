let alarmAudio = null;

export function primeAudio() {
  if (!alarmAudio) {
    alarmAudio = new Audio('/audio/alarm.mp3');
    alarmAudio.preload = 'auto';
    alarmAudio.loop = true;
    alarmAudio.volume = 0.55;
  }
  return true;
}

export function playTestBeep() {
  primeAudio();
  alarmAudio.currentTime = 0;
  alarmAudio.play().catch((error) => {
    console.warn('Random Alarm: custom alarm audio could not play.', error);
  });
  return true;
}

export function startAlarmSound() {
  primeAudio();
  alarmAudio.play().catch((error) => {
    console.warn('Random Alarm: custom alarm audio could not play.', error);
  });
}

export function pauseAlarmSound() {
  if (!alarmAudio) return;
  alarmAudio.pause();
}

export function resumeAlarmSound() {
  if (!alarmAudio) {
    startAlarmSound();
    return;
  }
  alarmAudio.play().catch((error) => {
    console.warn('Random Alarm: custom alarm audio could not resume.', error);
  });
}

export function stopAlarmSound() {
  if (!alarmAudio) return;
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
}
