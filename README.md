# QuestiMath

QuestiMath is a browser-based math practice PWA for building arithmetic fluency through levels, streaks, badges, and offline play.

## Features

- Gamified arithmetic practice with level progression and XP.
- Addition, subtraction, multiplication, and division challenges.
- Streak tracking, rank progress, and unlockable badges.
- Installable PWA with app icons and a service worker.
- Local progress storage with optional Firebase-backed cloud sync.
- Offline app shell caching for repeat play without a network connection.

## Running Locally

Serve the project from a local web server so the service worker and module imports work correctly:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project Structure

- `index.html` contains the React application and Firebase bootstrap.
- `manifest.json` defines the PWA install metadata.
- `sw.js` provides app shell, runtime, and dependency caching.
- `icon-192.png` and `icon-512.png` are the PWA icons.

## Firebase

The app works locally without Firebase credentials by saving progress in `localStorage`. When hosted in an environment that provides Firebase config globals, QuestiMath can sync player progress through Firestore.

## Release

Current version: `0.2.3`

## Author

Mike Lopez <e@mikelopez.com>

## License

QuestiMath is licensed under the GNU General Public License version 2. See [LICENSE](LICENSE).
