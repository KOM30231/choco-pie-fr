// A local array of excuses - no API calls, just Math.random() and honesty.
export const EXCUSES = [
  'I felt that your requested time was too predictable.',
  'The random number generator demanded it.',
  'Your requested time was merely a suggestion.',
  'I consulted absolutely nobody before making this decision.',
  'I detected excessive comfort in your sleep.',
  'The algorithm woke up before you did.',
  'Because I can.',
  'A coin was flipped. The coin does not answer to you.',
  'I ran the numbers. The numbers were funnier this way.',
  'Your circadian rhythm asked for a plot twist.',
  'This was, statistically, someone\'s alarm time.',
  'I was going to pick your time, then I got bored.',
  'Somewhere, a mathematician is proud of this outcome.',
  'The dice were rolled. You were not consulted.',
  'I simulated 10,000 mornings and chose the silliest one.',
  'Your alarm time has been redacted for comedic reasons.',
  'This time was chosen by a very confident random seed.',
  'I read your request, then set it down gently and ignored it.',
  'The universe rounds to the nearest inconvenience.',
  'It builds character. Also, it builds chaos.',
  'You set an alarm. I set the actual alarm.',
  'This is less "bug" and more "founding feature".',
  'I flipped a coin, consulted a magic 8-ball, then ignored both.',
];

/** Returns one random excuse. */
export function randomExcuse() {
  return EXCUSES[Math.floor(Math.random() * EXCUSES.length)];
}

// Extra flavor text used only while Chaos Mode is switched on -
// cycled through on the armed and ringing screens.
export const CHAOS_STATUS_MESSAGES = [
  'Calculating your suffering…',
  'Consulting the ancient alarm gods…',
  'Determining an unnecessarily inconvenient time…',
  'Your sleep schedule is about to experience character development.',
  'Selecting a time you will definitely complain about…',
  'Adding a pinch more chaos, for flavor…',
  'Rolling dice that only exist to upset you…',
  'This message is also random. Everything is random now.',
];

export function randomChaosStatus() {
  return CHAOS_STATUS_MESSAGES[Math.floor(Math.random() * CHAOS_STATUS_MESSAGES.length)];
}
