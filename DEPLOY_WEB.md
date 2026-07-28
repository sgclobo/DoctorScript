# Deploy DoctorScript Web Build

## Build the deployable site

Run this from the project root:

```bash
npm run export:web
```

This does two things:

1. Runs Expo static export for the web app.
2. Rewrites the exported `dist/` output so route links work on a standard static host.

## Upload to Hostinger

Upload everything inside `dist/` to your website root, usually `public_html/`.

Do not upload the `dist/` folder as a nested folder unless you specifically want the site to live at `/dist/`.

## Upload these generated items

- `dist/index.html`
- `dist/doctors/`
- `dist/patients/`
- `dist/prescriptions/`
- `dist/_expo/`
- `dist/assets/`
- `dist/pwa/`
- `dist/favicon.ico`
- `dist/404.html`
- `dist/+not-found.html`
- `dist/_sitemap/`
- `dist/_sitemap.html`

## Why the route folders matter

A plain static host usually cannot resolve app links like `/patients` if the export only contains `patients.html`.

The `npm run export:web` command fixes this by creating:

- `dist/patients/index.html`
- `dist/doctors/index.html`
- `dist/prescriptions/index.html`

That allows clean URLs to work without custom server rewrites.

## PWA files

All PWA-specific deploy assets are grouped in:

- `dist/pwa/manifest.webmanifest`
- `dist/pwa/sw.js`
- `dist/pwa/favicon.ico`
- `dist/pwa/icon-192.png`
- `dist/pwa/icon-512.png`

## Recommended deployment flow

1. Run `npm run export:web`
2. Open the generated `dist/` folder
3. Upload all contents inside `dist/` to `public_html/`
4. Visit your live domain and test:
   - `/`
   - `/patients/`
   - `/doctors/`
   - `/prescriptions/`
5. Confirm the browser sees the PWA manifest and service worker

## Do not upload

Do not upload source folders such as:

- `app/`
- `services/`
- `types/`
- `node_modules/`
- `public/`
- `package.json`
- TypeScript source files
