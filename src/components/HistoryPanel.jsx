import { formatDurationMinutes } from '../utils/time';

function computeStats(history) {
  if (history.length === 0) {
    return {
      total: 0,
      averageBetrayal: '—',
      mostEvil: '—',
      trustworthiness: '—',
    };
  }

  const total = history.length;
  const absDiffs = history.map((entry) => Math.abs(entry.diffMinutes));
  const averageAbs = absDiffs.reduce((sum, n) => sum + n, 0) / total;

  const worstEntry = history.reduce((worst, entry) =>
    Math.abs(entry.diffMinutes) > Math.abs(worst.diffMinutes) ? entry : worst
  );
  const worstDirection = worstEntry.diffMinutes < 0 ? 'early' : 'late';

  // Purely cosmetic "trust score" - drops as the average drift grows.
  const trustworthiness = Math.max(0, Math.round(100 - averageAbs * 2));

  return {
    total,
    averageBetrayal: `${formatDurationMinutes(averageAbs)}`,
    mostEvil: `${formatDurationMinutes(worstEntry.diffMinutes)} ${worstDirection}`,
    trustworthiness: `${trustworthiness}%`,
  };
}

export default function HistoryPanel({ history, onClear }) {
  const stats = computeStats(history);
  const recent = [...history].reverse().slice(0, 8);

  return (
    <div className="card fade-in">
      <div className="history-header">
        <span className="history-title">Damage Report</span>
        {history.length > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" style={{ width: 'auto' }} onClick={onClear}>
            Clear history
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-box__label">Alarms Survived</div>
          <div className="stat-box__value">{stats.total}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box__label">Avg. Betrayal</div>
          <div className="stat-box__value">{stats.averageBetrayal}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box__label">Worst Betrayal</div>
          <div className="stat-box__value">{stats.mostEvil}</div>
        </div>
        <div className="stat-box">
          <div className="stat-box__label">Software Trust</div>
          <div className="stat-box__value">{stats.trustworthiness}</div>
        </div>
      </div>

      {recent.length === 0 ? (
        <p className="history-empty">
          No alarm scheduled.
          <br />
          Enjoy your false sense of security.
        </p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Requested</th>
              <th>Actual</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((entry) => (
              <tr key={entry.timestamp}>
                <td>{entry.requestedLabel}</td>
                <td>{entry.actualLabel}</td>
                <td>
                  {entry.diffMinutes > 0 ? '+' : ''}
                  {entry.diffMinutes} min
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
