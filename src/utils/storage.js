// All persistence lives here, behind small functions, so the rest of
// the app never has to know it's talking to localStorage directly.
// If localStorage is unavailable (private browsing, quota exceeded,
// etc.) every function fails quietly instead of crashing the app.

const HISTORY_KEY = 'randomAlarm.history';
const ACTIVE_ALARM_KEY = 'randomAlarm.activeAlarm';

function safeGet(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn(`Random Alarm: could not read "${key}" from localStorage.`, error);
    return null;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Random Alarm: could not write "${key}" to localStorage.`, error);
    return false;
  }
}

function safeRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Random Alarm: could not remove "${key}" from localStorage.`, error);
  }
}

/** Returns the saved history array, oldest-to-newest, or [] if none. */
export function getHistory() {
  return safeGet(HISTORY_KEY) ?? [];
}

/**
 * Appends one entry to history and persists it.
 * entry: { requestedLabel, actualLabel, diffMinutes, mode, timestamp }
 */
export function addHistoryEntry(entry) {
  const history = getHistory();
  history.push(entry);
  safeSet(HISTORY_KEY, history);
  return history;
}

export function clearHistory() {
  safeSet(HISTORY_KEY, []);
}

/**
 * The "active alarm" is whatever is currently armed or ringing.
 * Saving it means a page refresh doesn't lose the alarm - see
 * App.jsx for how it's restored on load.
 */
export function saveActiveAlarm(alarm) {
  safeSet(ACTIVE_ALARM_KEY, alarm);
}

export function getActiveAlarm() {
  return safeGet(ACTIVE_ALARM_KEY);
}

export function clearActiveAlarm() {
  safeRemove(ACTIVE_ALARM_KEY);
}
