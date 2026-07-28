# PR Update

## Update Summary

A follow-up fix was added to ensure navigation works when opening exported files directly via `file://` (for example, `dist/index.html`) in addition to normal hosted HTTP environments.

## Included in This Update

- Updated home card links to point to explicit file targets:
  - `./patients/index.html`
  - `./prescriptions/index.html`
  - `./doctors/index.html`
- Updated "Back to Home" links on child pages to explicit file target:
  - `../index.html`
- Kept static-host route folder support from previous export workflow.

## Why This Was Needed

Some browsers show directory listings for paths like `file:///.../dist/doctors/` instead of automatically opening `index.html`. Using explicit file targets prevents that behavior and opens the intended page reliably.

## Commit

- `f8f5758` - Fix static file navigation links for exported web pages

## Verification

- `npx tsc --noEmit` passed.
- `npm run export:web` passed.
- Exported files now contain explicit file navigation targets:
  - `dist/index.html` links to `./patients/index.html`, `./prescriptions/index.html`, and `./doctors/index.html`
  - `dist/patients/index.html`, `dist/doctors/index.html`, and `dist/prescriptions/index.html` link back to `../index.html`

## PR Scope Impact

This update does not change data models or business logic. It only adjusts exported web navigation behavior for reliability in local file browsing and static deployments.
