// Small collection of date/time helpers.
// Kept separate from the components so the "randomization" logic
// (in randomAlarm.js) can be explained and tested on its own.

/**
 * Turns a "HH:mm" string (what an <input type="time"> gives us) into
 * the next real Date this time will occur.
 * If that time has already passed today, we roll over to tomorrow.
 */
export function nextOccurrenceOf(timeString, now = new Date()) {
  const [hours, minutes] = timeString.split(':').map(Number);

  const candidate = new Date(now);
  candidate.setHours(hours, minutes, 0, 0);

  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }

  return candidate;
}

/** Formats a Date as "7:00 AM" style text. */
export function formatClock(date) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Formats a "HH:mm" input string the same way, without needing a Date. */
export function formatTimeString(timeString, now = new Date()) {
  return formatClock(nextOccurrenceOf(timeString, now));
}

/** Whole-minute difference between two dates (b - a), can be negative. */
export function diffInMinutes(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

/** "43 minutes early" / "12 minutes late" / "bang on time" from a signed diff. */
export function describeDifference(diffMinutes) {
  if (diffMinutes === 0) return 'bang on time (statistically improbable)';
  const magnitude = Math.abs(diffMinutes);
  const unit = magnitude === 1 ? 'minute' : 'minutes';
  return diffMinutes < 0
    ? `${magnitude} ${unit} early`
    : `${magnitude} ${unit} late`;
}

/** Turns a minute count into "1h 12m" / "43m" style text. */
export function formatDurationMinutes(totalMinutes) {
  const magnitude = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(magnitude / 60);
  const minutes = magnitude % 60;
  if (hours === 0) return `${minutes}m`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

/** mm:ss (or hh:mm:ss once it's over an hour) countdown text. */
export function formatCountdown(msRemaining) {
  const totalSeconds = Math.max(0, Math.round(msRemaining / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
