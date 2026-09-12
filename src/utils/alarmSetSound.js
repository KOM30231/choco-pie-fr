let activeAlarmSetVoice = null;

/** Play the user's recorded confirmation immediately after an alarm is set. */
export function playAlarmSetVoice() {
  try {
    if (activeAlarmSetVoice) {
      activeAlarmSetVoice.pause();
      activeAlarmSetVoice.currentTime = 0;
    }

    activeAlarmSetVoice = new Audio('/audio/alarm-set.m4a');
    activeAlarmSetVoice.volume = 1;
    activeAlarmSetVoice.preload = 'auto';
    const playPromise = activeAlarmSetVoice.play();
    playPromise?.catch?.((error) => {
      console.warn('Random Alarm: alarm-set voice could not play.', error);
    });
    return true;
  } catch (error) {
    console.warn('Random Alarm: alarm-set voice could not play.', error);
    return false;
  }
}
