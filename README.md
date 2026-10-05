# Dotly: lock screen streaks (Expo + React Native)

Tracks yes/no, count and P&L trackers, draws them as a dot grid, and sets the grid as your **lock screen wallpaper** (Android).

## Important

Setting a wallpaper needs a small native module (included in `modules/lockscreen-wallpaper`).
**Expo Go will not work.** Use a development build.

## Run

```bash
npm install
npx expo install --fix          # aligns package versions with your Expo SDK
npx expo prebuild --platform android
npx expo run:android            # phone connected by USB with USB debugging on
```

The app uses Expo Router. Routes live in `app/(tabs)`, shared state is in
`src/context`, reusable UI is in `src/components`, and native integrations are
kept in `src/services`.
No local Android Studio? Use EAS instead:

```bash
npm i -g eas-cli && eas login
eas build:configure
eas build -p android --profile development
```

Then `npx expo start --dev-client` and open the installed app.

## Features

- Trackers: Yes/No, Count (with daily goal), P&L (green profit / red loss, auto-scaled to your own 90th percentile)
- Views: this month (big dots) or 365-day heatmap; single tracker or combined (brightness = share of trackers done)
- Privacy mode: dots only, no text on the wallpaper
- Broker CSV import (needs a `date` column and a column named pnl/profit/realized/net; dates as YYYY-MM-DD or DD-MM-YYYY)
- Streak counter; auto-update of the wallpaper 2.5 s after every change
- Data stored on-device (AsyncStorage)

## Known limits (v1)

- The wallpaper refreshes when the app is opened/used. Midnight refresh and notification-button logging need a background task (next step).
- Logging is for today only (no backfill UI yet).
- Test on your phone brand (Samsung/Xiaomi may treat lock-only wallpapers differently).

## Release

For each release, bump the Expo version in `app.json` and add a matching entry
at the top of `src/lib/changelog.ts`. Commit the changes and tag the release:

```bash
git commit -am "Release v1.1.0"
git tag v1.1.0
git push --tags
```

For JavaScript-only changes, publish an OTA update on the production channel:

```bash
eas update --channel production
```

Changes to the lock-screen module or other native dependencies require a new
Android build and Play Store submission:

```bash
eas build -p android --profile production
```

The app uses `runtimeVersion: { "policy": "appVersion" }`, so native changes
must also bump the version in `app.json`.

# dotlie
