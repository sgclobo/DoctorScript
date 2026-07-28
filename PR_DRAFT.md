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

## Update: Static File Navigation Fix

### Summary

A follow-up fix was added to ensure navigation works when opening exported files directly via `file://` (for example, `dist/index.html`) in addition to normal hosted HTTP environments.

### Included in This Update

- Updated home card links to explicit file targets:
  - `./patients/index.html`
  - `./prescriptions/index.html`
  - `./doctors/index.html`
- Updated "Back to Home" links on child pages to explicit file target:
  - `../index.html`
- Kept static-host route folder support from previous export workflow.

### Why This Was Needed

Some browsers show directory listings for paths like `file:///.../dist/doctors/` instead of automatically opening `index.html`. Using explicit file targets prevents that behavior and opens the intended page reliably.

### Commit

- `f8f5758` - Fix static file navigation links for exported web pages

### Verification

- `npx tsc --noEmit` passed.
- `npm run export:web` passed.
- Exported files now contain explicit file navigation targets:
  - `dist/index.html` links to `./patients/index.html`, `./prescriptions/index.html`, and `./doctors/index.html`
  - `dist/patients/index.html`, `dist/doctors/index.html`, and `dist/prescriptions/index.html` link back to `../index.html`

### Scope Impact

This update does not change data models or business logic. It only adjusts exported web navigation behavior for reliability in local file browsing and static deployments.
