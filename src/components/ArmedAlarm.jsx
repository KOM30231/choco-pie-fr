import { useEffect, useState } from 'react';
import { formatClock, formatCountdown } from '../utils/time';

const armedMessages = [
  'She is calculating. You should probably be concerned.',
  'The alarm has been armed. Your trust has been misplaced.',
  'Your requested time has been received and immediately ignored.',
];

export default function ArmedAlarm({ requestedDate, onCancel }) {
  const [now, setNow] = useState(() => new Date());
  const [message] = useState(() => armedMessages[Math.floor(Math.random() * armedMessages.length)]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  function cancel() {
    onCancel();
  }

  const msRemaining = requestedDate.getTime() - now.getTime();

  return (
    <div className="card fade-in armed-card">
      <div className="armed-stamp">ALARM<br />ARMED</div>
      <div className="armed-hero">😌</div>
      <p className="girl-name armed-name">PROJECT SANIMA IS PRETENDING TO BE NORMAL</p>
      <p className="armed-message">{message}</p>
      <p className="armed-request-label">You requested</p>
      <div className="armed-time">{formatClock(requestedDate)}</div>
      <p className="countdown">{msRemaining > 0 ? `Roughly ${formatCountdown(msRemaining)} away` : 'Any moment now...'}</p>

      <div className="secret-box">
        <span>🔐</span>
        <div><strong>THE SECRET TIME IS LOCKED</strong><small>Only PROJECT SANIMA knows when she is coming.</small></div>
      </div>

      <div className="fake-ticket">
        <span>CASE #000</span>
        <strong>WAKE-UP INCIDENT</strong>
        <span>STATUS: SUSPICIOUS</span>
      </div>

      <div className="armed-actions">
        <button type="button" className="btn btn-secondary" onClick={cancel}>🚪 CANCEL MY BAD DECISION</button>
      </div>
      <p className="warning-note">“Everything is completely under control.” — a statement not supported by evidence</p>
    </div>
  );
}
