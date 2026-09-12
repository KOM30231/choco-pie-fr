import { useEffect, useState } from 'react';
import { formatClock, describeDifference } from '../utils/time';
import { startAlarmSound, stopAlarmSound, pauseAlarmSound, resumeAlarmSound } from '../utils/sound';
import { MOODS, STOP_REACTIONS, playVoice, stopVoice } from '../utils/persona';

export default function RingingAlarm({ requestedDate, actualDate, offsetMinutes, onStop }) {
  const [stopAttempts, setStopAttempts] = useState(0);
  const [mood, setMood] = useState(MOODS[0]);
  const [dialogue, setDialogue] = useState('Wake up. You really thought I was going to respect your chosen time?');
  const [alarmCount, setAlarmCount] = useState(0);

  useEffect(() => {
    startAlarmSound();
    playDialogue('chill');
    const id = window.setInterval(() => setAlarmCount((count) => count + 1), 900);
    return () => {
      window.clearInterval(id);
      stopAlarmSound();
      stopVoice();
    };
  }, []);

  function playDialogue(voiceKey) {
    pauseAlarmSound();
    let resumed = false;
    const resume = () => {
      if (resumed) return;
      resumed = true;
      resumeAlarmSound();
    };
    const played = playVoice(voiceKey, resume);
    if (!played) resume();
  }

  function handleStopClick() {
    const nextAttempt = stopAttempts + 1;
    if (nextAttempt >= STOP_REACTIONS.length + 1) {
      stopVoice();
      stopAlarmSound();
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        onStop();
      };
      playVoice('final', finish);
      // Safety fallback in case the browser cannot report the audio end event.
      window.setTimeout(finish, 6000);
      return;
    }

    const reaction = STOP_REACTIONS[nextAttempt - 1];
    setStopAttempts(nextAttempt);
    setMood(reaction.mood);
    setDialogue(`Reaction ${nextAttempt}: ${reaction.mood.label}`);
    playDialogue(reaction.voiceKey);
  }

  const buttonText = stopAttempts === 0
    ? '🛑 STOP THIS NONSENSE'
    : stopAttempts <= STOP_REACTIONS.length
      ? STOP_REACTIONS[stopAttempts - 1]?.button || '😈 MAKE ME STOP'
      : '🛑 STOP';

  const chaosWord = ['NOPE', 'WAKE UP', 'HELLO?!', 'GET UP', 'SERIOUSLY?!'][alarmCount % 5];

  return (
    <div className={`card ringing-card fade-in mood-${mood.key}`}>
      <div className="alarm-noise">{chaosWord}</div>
      <div className="alarm-character">{mood.emoji}</div>
      <p className="ringing-title">🚨 PROJECT SANIMA HAS ARRIVED 🚨</p>
      <p className="ringing-subtitle">{dialogue}</p>

      <div className="mood-meter">
        <div className="mood-meter__label">CURRENT THREAT LEVEL: <strong>{mood.label}</strong></div>
        <div className="mood-meter__track">
          <div className="mood-meter__fill" style={{ width: `${Math.max(12, mood.level * 25)}%` }} />
        </div>
        <div className="mood-meter__emojis">😌　🤨　😤　😭　😈</div>
      </div>

      <div className="reveal-grid">
        <div className="reveal-box"><div className="reveal-box__label">YOU REQUESTED</div><div className="reveal-box__value">{formatClock(requestedDate)}</div></div>
        <div className="reveal-box reveal-box--evil"><div className="reveal-box__label">I CHOSE</div><div className="reveal-box__value">{formatClock(actualDate)}</div></div>
      </div>

      <p className="reveal-diff">Difference: {describeDifference(offsetMinutes)}</p>
      <div className="betrayal-sticker">YOUR SCHEDULE HAS BEEN <strong>DECLINED</strong></div>

      <button type="button" className="btn btn-danger stop-mood-button" onClick={handleStopClick}>{buttonText}</button>
      <p className="warning-note">You trusted software. This was your first mistake.</p>
      {stopAttempts > 0 && <p className="attempt-counter">STOP ATTEMPTS: {stopAttempts} / {STOP_REACTIONS.length + 1}</p>}
    </div>
  );
}
