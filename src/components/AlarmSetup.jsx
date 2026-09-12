import { useState } from 'react';
import { playTestBeep, primeAudio } from '../utils/sound';

export default function AlarmSetup({ onArm, hasError }) {
  const [requestedTime, setRequestedTime] = useState('07:00');
  const [testMode, setTestMode] = useState(false);
  const [validationError, setValidationError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    primeAudio();
    if (!requestedTime) {
      setValidationError('Pick a time first. Even chaos needs a starting point.');
      return;
    }
    setValidationError('');
    onArm({ requestedTime, testMode });
  }

  function handleTestSound() {
    primeAudio();
    playTestBeep();
  }

  return (
    <form className="card setup-card fade-in" onSubmit={handleSubmit}>
      <div className="chaos-banner">
        <span>⚠️</span>
        <div>
          <strong>PUBLIC SERVICE ANNOUNCEMENT</strong>
          <small>This alarm has no respect for your plans.</small>
        </div>
        <span>⚠️</span>
      </div>

      <div className="control-panel-banner-wrap">
        <img
          className="control-panel-banner"
          src="/control-panel-banner.png"
          alt="Project Sanima's totally legit control panel with an evil alarm clock mascot"
        />
      </div>

      <div className="time-zone-label">
        <span>⏰</span>
        <span>THE TIME YOU <strong>THINK</strong> YOU'RE GETTING</span>
      </div>
      <label className="field-label" htmlFor="wake-time">Your completely reasonable wake-up time</label>
      <input
        id="wake-time"
        className="time-input"
        type="time"
        value={requestedTime}
        onChange={(e) => setRequestedTime(e.target.value)}
        required
      />

      <div className="fake-control-panel">
        <div className="panel-screw">✦</div>
        <div className="panel-copy">
          <span className="panel-kicker">SECRET ALGORITHM</span>
          <strong>RANDOMNESS: <span>YES</span></strong>
          <small>There are no difficulty settings. That would imply control.</small>
        </div>
        <div className="random-wheel" aria-hidden="true">?</div>
      </div>

      <div className="mystery-card">
        <div className="mystery-icon">🎲</div>
        <div>
          <strong>WHAT TIME WILL IT ACTUALLY RING?</strong>
          <p>Great question. Even PROJECT SANIMA doesn't know yet.</p>
        </div>
        <span className="classified">CLASSIFIED</span>
      </div>

      <div className="toggle-row demo-toggle">
        <div className="toggle-row__text">
          <span className="toggle-row__title">⚡ Demo Mode</span>
          <span className="toggle-row__desc">Rings in about 10 seconds. For science. Mostly.</span>
        </div>
        <label className="switch">
          <input type="checkbox" checked={testMode} onChange={(e) => setTestMode(e.target.checked)} />
          <span className="switch__track" /><span className="switch__thumb" />
        </label>
      </div>

      {(validationError || hasError) && <p className="setup-error">{validationError || hasError}</p>}

      <div className="button-stack">
        <button type="submit" className="btn btn-primary setup-submit">💅 DO YOUR WORST</button>
        <button type="button" className="btn btn-ghost" onClick={handleTestSound}>🔊 HEAR THE MENACE</button>
      </div>

      <p className="tiny-disclaimer">By pressing the button, you agree to absolutely nothing.</p>
    </form>
  );
}
