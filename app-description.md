**App Name:** DoctorScript

**Overview:** 
DoctorScript is a streamlined, privacy-first mobile application designed specifically for medical practitioners to seamlessly manage their clinical workspace, patient profiles, and digital prescriptions completely offline.

**Core Functionalities & Features:**
*   **Practitioner Profile Management:** Setup and maintain a digital workspace with professional credentials (name, specialty, license number) and upload a secure digital footprint (base64-encoded signature).
*   **Patient Intake & Records:** Register patients securely with essential demographic data (Name, Date of Birth, Phone Number) and track their clinical history.
*   **Digital Prescription Engine:** Generate professional digital prescriptions with dynamic line items for medications, including dosages, frequencies, durations, and detailed clinical notes.
*   **Export & Sharing:** Instantly convert and export prescriptions as crisp formatting PDFs or high-quality Images that can be saved directly to the device's gallery or securely shared through the native iOS/Android sharing sheet.
*   **Data Archiving & Privacy:** Built entirely on a local SQLite database that ensures offline data integrity. Doctors can wipe their profile entirely or export all historical patient and script data to a standard CSV spreadsheet for auditing or backup.

**Benefits to the User (The Doctor):**
*   **Efficiency:** Streamlines the clinical workflow by eliminating handwritten prescribing and fragmented physical patient records. Everything happens from one secure dashboard.
*   **Professionalism:** Automatically generates clean, legible, and properly formatted "℞" slips bearing their verifiable credential information and digital signature.
*   **Ownership:** A strictly on-device, serverless architecture means the doctor completely owns and controls their patient data with no cloud subscriptions or internet dependency. 

**Benefits to the Patient:**
*   **Safety & Clarity:** Eliminates the classic risk of illegible handwriting. The digital layout ensures pharmacists and patients clearly understand exact medication names, dosages (e.g., *500mg*), and instructions (e.g., *TID, 10 days*).
*   **Convenience:** Patients can receive their prescription instantly via digital messaging as a PDF or Image, completely removing the frustration of losing or damaging a paper slip. 
*   **Privacy Secure:** Their sensitive health identification and medication history are kept encrypted and natively air-gapped on the attending doctor's personal device.