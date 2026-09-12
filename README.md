# Random Alarm

An alarm clock app that asks you what time you want to wake up, tells you
it's scheduled that alarm, and then rings at a secretly-randomized time
instead.

## Why does this project exist?

It doesn't.

More seriously: it exists as a small, self-contained project for practicing
real front-end fundamentals - timers, randomization, `Date` math, local
storage, component-based UI state, browser audio, and notifications - all
wrapped around a joke simple enough to explain in one sentence.

## Features

- Pick a wake-up time with a normal-looking time picker
- Three randomization modes: **Slightly Evil** (±15 min), **Chaotic**
  (±1 hour), and **Absolutely Unhinged** (anywhere from 4:00 AM–10:00 AM)
- **Chaos Mode** to widen the randomization further and add sarcastic
  status messages while the alarm is armed
- **Test Mode** to trigger the alarm in ~10 seconds instead of waiting
  until morning, for quick demos
- A dramatic "reveal" screen when the alarm rings, showing the requested
  time vs. the actual time and the difference between them
- An alarm sound generated in the browser (no external audio files)
- 20+ randomly-chosen excuses for why the time changed
- Alarm history and joke statistics ("Trustworthiness: 0%"), saved in
  `localStorage` so they survive a page refresh
- If the tab is closed or refreshed while an alarm is armed or ringing,
  it's restored from `localStorage` when the page reopens

## Technologies used

- [React](https://react.dev/) (function components + hooks, no extra
  state library)
- [Vite](https://vite.dev/) as the build tool / dev server
- Plain CSS (no framework) using CSS custom properties for theming
- The browser's built-in Web Audio API for sound and `localStorage` for
  persistence - no backend, no database, no external APIs

## Project structure

```text
random-alarm/
├── src/
│   ├── components/     UI pieces (setup screen, armed screen, etc.)
│   ├── utils/           Randomization, time formatting, storage, sound
│   ├── App.jsx          The state machine that ties the screens together
│   ├── main.jsx         React entry point
│   └── index.css        All styling and design tokens
├── public/               Favicon
├── index.html
└── package.json
```

## How to run it locally

These steps assume you've never used a terminal before - if you already
know your way around Node.js, just run `npm install && npm run dev`.

### 1. Install Node.js (skip if you already have it)

Random Alarm needs [Node.js](https://nodejs.org/) to run. To check if you
already have it, open a terminal:

- **Windows:** click Start, type `cmd`, press Enter.
- **Mac:** open Spotlight (Cmd+Space), type `Terminal`, press Enter.

Then type `node -v` and press Enter. If you see a version number like
`v20.11.0`, you're set - skip to step 2. If you see an error, download
the "LTS" installer from [nodejs.org](https://nodejs.org/), run it with
the default options, then close and reopen your terminal.

### 2. Open the project folder in your terminal

In the terminal, type `cd ` (with a trailing space), then drag the
`random-alarm` folder from your file explorer/Finder into the terminal
window - it will paste the folder's path automatically. Press Enter.

### 3. Install the project's dependencies

Type:

```bash
npm install
```

and press Enter. This downloads React, Vite, and a couple of small dev
tools into a `node_modules` folder. It can take a minute the first time;
you'll see progress text and then your prompt back.

### 4. Start the app

```bash
npm run dev
```

Vite will print a local address, typically:

```text
➜  Local:   http://localhost:5173/
```

Open that address in your browser (Chrome, Firefox, or Edge all work).
The app is now running. Leave the terminal window open - closing it stops
the app.

### 5. Stop the app

Click back into the terminal and press `Ctrl+C`.

## Known browser limitations

- **The tab must stay open.** Browsers don't let regular web pages wake
  up and run code while completely closed, so this can't reliably alarm
  you if you close the tab or shut down your browser. It's honest about
  this rather than pretending otherwise.
- **Audio needs a first interaction.** Browsers block sound from playing
  before you've clicked something on the page. Random Alarm "unlocks"
  audio the moment you press Set Alarm or Test Alarm Sound, so as long as
  you've done that once, the alarm sound will play normally when it rings.
- **History and the active alarm live in your browser's `localStorage`.**
  Clearing your browser data, using a different browser, or browsing in
  private/incognito mode will reset them.

## How the randomization works

The core logic lives in `src/utils/randomAlarm.js`, in one function:
`computeActualAlarm`. It runs exactly once, the moment you press
**Set Random Alarm** - never on a repeating timer - so the secret time is
fixed as soon as the alarm is armed:

1. Convert the time you picked (e.g. `07:00`) into the next real `Date`
   it will occur (today, or tomorrow if that time already passed today).
2. Depending on the mode:
   - **Slightly Evil / Chaotic:** pick a random whole number of minutes
     between `-range` and `+range` (15 or 60), and add it to the
     requested time.
   - **Absolutely Unhinged:** ignore the offset idea entirely and pick a
     random minute somewhere between 4:00 AM and 10:00 AM.
   - If **Chaos Mode** is on, the offset range for the first two modes is
     widened by 75%.
3. Store both the requested time and the real (secret) time. The UI only
   ever displays the requested time until the alarm actually rings.

A `setInterval` in `App.jsx` checks every half-second whether the current
time has reached the secret time, and switches the screen to the
"SURPRISE" reveal the moment it does.
