# PR Title

Add PWA support for the DoctorScript web release

# PR Description

## Summary

This PR prepares the DoctorScript web release branch for installable PWA usage, fixes static-host route navigation, and verifies the app still loads cleanly in the browser.

## What Changed

- Added a web HTML shell entry in `app/+html.tsx`.
- Added PWA metadata to the web shell:
  - manifest link
  - theme color
  - apple mobile web app metadata
- Consolidated PWA assets into `public/pwa/` for easier deployment:
  - `public/pwa/manifest.webmanifest`
  - `public/pwa/sw.js`
  - `public/pwa/favicon.ico`
  - `public/pwa/icon-192.png`
  - `public/pwa/icon-512.png`
- Registered the service worker from `app/_layout.tsx` during web startup.
- Added an `export:web` script in `package.json` for deployment-ready web builds.
- Added `scripts/prepare-web-dist.js` to post-process the Expo export and create static-host-friendly route folders:
  - `dist/doctors/index.html`
  - `dist/patients/index.html`
  - `dist/prescriptions/index.html`
  - `dist/404.html`
- Preserved clean app URLs like `/patients`, `/doctors`, and `/prescriptions` for standard static hosts without custom rewrite rules.

## Verification

- `npx tsc --noEmit` passed.
- `npm run lint -- --no-cache` passed.
- `npm run export:web` passed.
- Browser verification on `http://localhost:8085` confirmed:
  - manifest is present
  - theme color is present
  - service worker is registered and active
- Static-host verification confirmed clean routes now resolve from the generated `dist/` output.

## Notes

- The app remains on the `release/web` branch.
- This PR is focused on PWA readiness for web deployment.
- No merge or PR submission has been performed yet.
