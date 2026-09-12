export default function Header({ statusText, statusVariant = 'calm', mood }) {
  const pillClass =
    statusVariant === 'alarm'
      ? 'status-pill status-pill--alarm'
      : statusVariant === 'armed'
      ? 'status-pill status-pill--armed'
      : 'status-pill';

  return (
    <header className="app-header">
      <div className="persona-badge">💅 PROJECT SANIMA</div>
      <h1 className="app-header__title">PROJECT SANIMA</h1>
      <p className="app-header__subtitle">
        You set the time. <strong>I set the mood.</strong>
      </p>
      <div className={pillClass}>
        <span className="status-dot" />
        {statusText}
      </div>
      {mood && (
        <div className="mood-chip">
          {mood.emoji} Mood: <strong>{mood.label}</strong>
        </div>
      )}
    </header>
  );
}
