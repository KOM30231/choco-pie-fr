import { useEffect, useState } from 'react';
import { formatClock, describeDifference, formatDurationMinutes } from '../utils/time';
import Confetti from './Confetti';

export default function ResultScreen({ requestedDate, actualDate, offsetMinutes, excuse, onReset }) {
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => setShowConfetti(false), 2800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="card fade-in result-card">
      {showConfetti && <Confetti />}
      <div className="result-character">💅😈</div>
      <p className="result-title">You survived PROJECT SANIMA.</p>
      <p className="result-microcopy">She is disappointed, but strangely proud.</p>
      <div className="reveal-grid">
        <div className="reveal-box"><div className="reveal-box__label">REQUESTED</div><div className="reveal-box__value">{formatClock(requestedDate)}</div></div>
        <div className="reveal-box"><div className="reveal-box__label">ACTUAL</div><div className="reveal-box__value">{formatClock(actualDate)}</div></div>
      </div>
      <p className="reveal-diff" style={{ color: 'var(--state-calm)' }}>Difference: {describeDifference(offsetMinutes)}</p>
      <div className="damage-grid">
        <div><span>Sleep stolen</span><strong>{formatDurationMinutes(offsetMinutes)}</strong></div>
        <div><span>Your trust</span><strong>0%</strong></div>
      </div>
      <div className="excuse-box">“{excuse}”<br /><span>— PROJECT SANIMA</span></div>
      <div style={{ height: 22 }} />
      <button type="button" className="btn btn-primary" onClick={onReset}>💅 SET ANOTHER BAD DECISION</button>
      <p className="warning-note">Your productivity starts tomorrow.</p>
    </div>
  );
}
