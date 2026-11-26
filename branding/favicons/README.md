# Favicons

Source files live at the repo root (`favicon.png`, `favicon.ico`). Derived sizes in this folder are copied into each app’s `public/`:

- `favicon.ico` — legacy / Safari fallback
- `favicon-16x16.png`, `favicon-32x32.png` — browser tabs
- `apple-touch-icon.png` (180×180) — iOS home screen
- `android-chrome-192x192.png`, `android-chrome-512x512.png` — PWA / Android
- `site.webmanifest` — per-app name and icon list (in each `public/`)

Regenerate from the root PNG when the mark changes, then copy into `apps/web/public`, `apps/studio/public`, and `apps/selfhost/public`.
