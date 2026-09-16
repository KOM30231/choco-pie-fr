import { useEffect, useState } from 'react';
import Header from './components/Header';
import AlarmSetup from './components/AlarmSetup';
import ArmedAlarm from './components/ArmedAlarm';
import RingingAlarm from './components/RingingAlarm';
import ResultScreen from './components/ResultScreen';
import HistoryPanel from './components/HistoryPanel';
import { computeActualAlarm } from './utils/randomAlarm';
import { nextOccurrenceOf, diffInMinutes, formatClock } from './utils/time';
import { randomExcuse } from './utils/excuses';
import { MOODS } from './utils/persona';
import { playAlarmSetVoice } from './utils/alarmSetSound';
import { getHistory, addHistoryEntry, clearHistory, getActiveAlarm, saveActiveAlarm, clearActiveAlarm } from './utils/storage';

export default function App() {
  const [screen, setScreen] = useState('idle');
  const [alarm, setAlarm] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState(() => getHistory());
  const [setupError, setSetupError] = useState('');

  useEffect(() => {
    const saved = getActiveAlarm();
    if (!saved) return;
    try {
      const requestedDate = new Date(saved.requestedISO);
      const actualDate = new Date(saved.actualISO);
      const restored = { requestedDate, actualDate, offsetMinutes: saved.offsetMinutes };
      setAlarm(restored);
      setScreen(Date.now() >= actualDate.getTime() ? 'ringing' : 'armed');
    } catch (error) {
      console.warn('PROJECT JEROME: could not restore saved alarm.', error);
      clearActiveAlarm();
    }
  }, []);

  useEffect(() => {
    if (screen !== 'armed' || !alarm) return undefined;
    const id = window.setInterval(() => {
      if (Date.now() >= alarm.actualDate.getTime()) setScreen('ringing');
    }, 250);
    return () => window.clearInterval(id);
  }, [screen, alarm]);

  function handleArm({ requestedTime, testMode }) {
    const now = new Date();
    let requestedDate;
    let actualDate;
    let offsetMinutes;
    if (testMode) {
      requestedDate = nextOccurrenceOf(requestedTime, now);
      actualDate = new Date(now.getTime() + 10_000);
      offsetMinutes = diffInMinutes(requestedDate, actualDate);
    } else {
      const computed = computeActualAlarm(requestedTime, now);
      requestedDate = computed.requestedDate;
      actualDate = computed.actualDate;
      offsetMinutes = computed.offsetMinutes;
    }
    const nextAlarm = { requestedDate, actualDate, offsetMinutes };
    setAlarm(nextAlarm);
    setSetupError('');
    setScreen('armed');
    saveActiveAlarm({ requestedISO: requestedDate.toISOString(), actualISO: actualDate.toISOString(), offsetMinutes });
    playAlarmSetVoice();
  }

  function handleCancel() {
    clearActiveAlarm();
    setAlarm(null);
    setScreen('idle');
  }

  function handleStop() {
    if (!alarm) return setScreen('idle');
    const entry = {
      requestedLabel: formatClock(alarm.requestedDate),
      actualLabel: formatClock(alarm.actualDate),
      diffMinutes: alarm.offsetMinutes,
      timestamp: Date.now(),
    };
    setHistory(addHistoryEntry(entry));
    clearActiveAlarm();
    setLastResult({ requestedDate: alarm.requestedDate, actualDate: alarm.actualDate, offsetMinutes: alarm.offsetMinutes, excuse: randomExcuse() });
    setAlarm(null);
    setScreen('result');
  }

  const mood = screen === 'ringing' ? MOODS[4] : MOODS[0];
  const statusByScreen = {
    idle: { text: 'The alarm is pretending to work', variant: 'calm' },
    armed: { text: 'Alarm armed. Requested time noted (and ignored).', variant: 'armed' },
    ringing: { text: 'IT IS HAPPENING', variant: 'alarm' },
    result: { text: 'She survived. Barely.', variant: 'calm' },
  };
  const status = statusByScreen[screen];

  return (
    <div className="app-shell">
      <Header statusText={status.text} statusVariant={status.variant} mood={mood} />
      {screen === 'idle' && <AlarmSetup onArm={handleArm} hasError={setupError} />}
      {screen === 'armed' && alarm && <ArmedAlarm requestedDate={alarm.requestedDate} onCancel={handleCancel} />}
      {screen === 'ringing' && alarm && <RingingAlarm requestedDate={alarm.requestedDate} actualDate={alarm.actualDate} offsetMinutes={alarm.offsetMinutes} onStop={handleStop} />}
      {screen === 'result' && lastResult && <ResultScreen requestedDate={lastResult.requestedDate} actualDate={lastResult.actualDate} offsetMinutes={lastResult.offsetMinutes} excuse={lastResult.excuse} onReset={() => { setLastResult(null); setScreen('idle'); }} />}
      <HistoryPanel history={history} onClear={() => { clearHistory(); setHistory([]); }} />
    </div>
  );
}
