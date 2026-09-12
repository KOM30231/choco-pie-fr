import { nextOccurrenceOf, diffInMinutes } from './time';

/** Random integer in [min, max], inclusive. */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * PROJECT SANIMA has one setting: unpredictable.
 * The requested time is only a suggestion. The actual alarm is chosen once
 * when the alarm is armed and stays secret until it rings.
 */
export function computeActualAlarm(requestedTimeString, now = new Date()) {
  const requestedDate = nextOccurrenceOf(requestedTimeString, now);
  const roll = Math.random();
  let actualDate;

  if (roll < 0.60) {
    // Usually a nasty surprise near the requested time.
    const offset = randomInt(-60, 60);
    actualDate = new Date(requestedDate.getTime() + offset * 60000);
  } else if (roll < 0.90) {
    // Sometimes PROJECT SANIMA decides an hour or two is a reasonable amount of chaos.
    const offset = randomInt(-180, 180);
    actualDate = new Date(requestedDate.getTime() + offset * 60000);
  } else {
    // Rarely: complete betrayal. Pick any morning time from 4 AM to 10 AM.
    const dayStart = new Date(requestedDate);
    dayStart.setHours(0, 0, 0, 0);
    actualDate = new Date(dayStart);
    actualDate.setMinutes(randomInt(4 * 60, 10 * 60));
  }

  // Never schedule the secret time in the past.
  while (actualDate.getTime() <= now.getTime()) {
    actualDate.setDate(actualDate.getDate() + 1);
  }

  return {
    requestedDate,
    actualDate,
    offsetMinutes: diffInMinutes(requestedDate, actualDate),
  };
}
