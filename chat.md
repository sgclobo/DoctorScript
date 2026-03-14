Viewed database.ts:1-54
Viewed index.tsx:1-97
Searched for "Save Patient"
Viewed patients.tsx:1-136
Edited database.ts
Edited patients.tsx
Searched for "text-on_primary"
Searched for "text-on_primary"
Searched for "Create Prescription"
Viewed prescriptions.tsx:1-389
Edited prescriptions.tsx
Edited index.tsx
Ran command: `npx tsc --noEmit`

Excellent, that makes perfect sense for data hygiene and text contrast visibility.

I have made those adjustments! Here is what was updated:

1.  **Light Button/Banner Text:** I scrubbed the main buttons ("Save Patient", "Create Prescription") across the app and the Home Hero Banner to explicitly use `text-white` over the dark primary background for optimal contrast and readability.
2.  **Doctor Onboarding:**
    *   I updated [services/database.ts](cci:7://file:///x:/reseita/DoctorScript/services/database.ts:0:0-0:0) to **remove the automatic mock doctor insertion** that originally bypassed the empty state.
    *   I heavily modified `app/(tabs)/index.tsx`. Now, when you open the app, it runs a check on the database. If there are **no** doctors registered, you are greeted with a dedicated **Welcome Setup - Practitioner Profile** form asking for your Name, Specialty, License, and Phone.
    *   Once you fill out the required setup form, it inserts that profile into the database and seamlessly re-renders the actual Clinical Dashboard reflecting `Welcome back, [Your Name]`. 

If you reopen or reload the app with the current state (since the server is already running with `npx expo start -c`), you'll be greeted by the new Doctor Setup Profile (you might need to delete the `doctorscript.db` if the mock doctor got stored previously on your test iPhone, or simply uninstall and reinstall the dev-build on Expo Go to start totally fresh!).

Let me know if there's anything else you'd like refined!

## On PC the display is correct and perfectly readable. On iPhone the app failed to load. On Android it loaded but with error