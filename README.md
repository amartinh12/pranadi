# PraNadi

PraNadi is an iPhone wellness app for a daily chakra practice, based on the guide *Journey Through the Chakras*. You choose a chakra (or answer a short check-in to find one), pick how much time you have, and follow a guided practice one pose at a time, with a timer.

The look is an illustrated yoga journal: warm ivory paper, soft watercolour artwork, deep ink text, and a muted accent colour for the chosen chakra.

## Principles

- **Fully stateless.** Nothing is saved between sessions. No accounts, no storage, no tracking. Selections and the timer live only in memory while the app is open.
- **One-time purchase.** $0.99, no subscriptions.
- **Light on storage.** Images are compressed JPEGs, and only the font weights in use are bundled.
- **iOS first**, built with React Native and Expo.

## The journey through the app

1. **Welcome** – the app name and a Begin button.
2. **Introduction** – a short welcome to PraNadi.
3. **How would you like to begin today?** – two paths:
   - *I'll choose my focus* → pick a chakra on the seven-chakra illustration.
   - *Check in with yourself* → a 14-question check-in that points to the chakra that needs care.
4. **Chakra introduction** – the chakra's description, affirmation and journal prompt.
5. **How much time feels right today?** – Pause (5 min), Flow (20 min) or Journey (45 min).
6. **Practice** – one pose per page with its illustration, a description, a suggested time and a countdown. Back, Pause/Resume, Next and Skip are always within reach, and an exit button returns to the start.

A **Start over** control is available on every screen after the welcome.

## Content status

| Chakra | Introduction | Practice sessions |
|---|---|---|
| Root (Muladhara) | Yes | Pause, Flow, Journey |
| Sacral (Svadhisthana) | Yes | Pause, Flow, Journey |
| Solar Plexus, Heart, Throat, Third Eye, Crown | Yes | Coming soon |

Practice sessions are built from the guide's pose lists: Pause uses a few key poses, Flow adds three warm-ups, and Journey is the full sequence with warm-ups.

## Getting started

**Requirements:** Node.js, and the **Expo Go** app on your iPhone (it must support Expo SDK 58).

```bash
git clone https://github.com/amartinh12/pranadi.git
cd pranadi
npm install --legacy-peer-deps
npx expo start --clear
```

Scan the QR code with your iPhone camera to open the app in Expo Go. Use `--clear` after adding or renaming files so Metro doesn't serve a stale cache.

Type-check:

```bash
npx tsc --noEmit
```

(One known, harmless error is reported for `index.ts`, a leftover from the project template.)

## Project structure

```
app/            Screens (expo-router: one file per screen)
  index.tsx           Welcome
  intro.tsx           Introduction
  branch.tsx          "How would you like to begin today?"
  check-in.tsx        Choose a chakra
  quiz.tsx            14-question check-in
  quizData.ts         Questions and scoring
  chakra-of-the-day.tsx   Chakra introduction
  intensity.tsx       Practice duration
  practice.tsx        Guided practice and timer
  closing-reflection.tsx  Placeholder
components/     Shared pieces (Text, StartOver)
content/        Chakra content, practice sessions, pose image map
theme/          Colours, fonts and spacing tokens
assets/         Watercolour backgrounds and pose illustrations
```

## Design notes

- **Fonts:** Playfair Display for headings, DM Sans for everything else. They are loaded from individual font files in `app/_layout.tsx`, so only the weights in use ship with the app.
- **Colours:** warm ivory, deep ink and warm grey are used everywhere. Chakra colours are accents only and appear after a chakra has been chosen.
- **Artwork:** each screen sits on text-free watercolour artwork. All text, buttons and tap areas are real UI placed over it, so they stay sharp and accessible at any screen size. Tall phones cover the artwork; short or wide screens fit it whole.
- **Accessibility:** large touch targets, screen-reader labels, support for larger text, and animations that respect the Reduce Motion setting.

## Contributing and working rules

Project rules for contributors and coding assistants are in [`AGENTS.md`](AGENTS.md): small steps, no new dependencies without asking, and nothing that persists data.

## Licence

See [`LICENSE`](LICENSE).
