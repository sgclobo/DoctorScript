const en = {
  // Common
  cancel: "Cancel",
  error: "Error",
  success: "Success",
  delete: "Delete",

  // Tabs
  tab_home: "Home",
  tab_patients: "Patients",
  tab_prescriptions: "Prescriptions",
  tab_help: "Help",

  // Home Screen
  home_welcome_setup: "Welcome Setup",
  home_edit_profile: "Edit Profile",
  home_practitioner_profile: "Practitioner Profile",
  home_setup_desc:
    "It looks like this is your first time opening the app. Please enter your details below so we can issue scripts under your authority.",
  home_edit_desc:
    "Update your practitioner details and digital signature below.",
  home_full_name: "Your Full Name",
  home_email: "Email",
  home_specialty: "Specialty",
  home_license: "License Number (Optional)",
  home_contact_phone: "Contact Phone (Optional)",
  home_digital_signature: "Digital Signature",
  home_upload_signature: "Upload Signature Image",
  home_complete_setup: "Complete Setup",
  home_save_changes: "Save Changes",
  home_welcome_back: "Welcome back, {{name}}.",
  home_hero_desc:
    "Efficiently manage your clinical workspace with precision. Access patient records, manage practitioners, and issue digital prescriptions from one secure dashboard.",
  home_today_snapshot: "Today's Snapshot",
  home_patients_stat: "Patients",
  home_active_drs: "Active Drs",
  home_pharmacy_fulfilment: "Pharmacy Fulfilment",
  home_manage_patients: "Manage patient profiles",
  home_manage_prescriptions: "View and create prescriptions",
  home_profile_options: "Profile Options",
  home_manage_workspace: "Manage your workspace",
  home_export_csv: "Export Data (CSV)",
  home_delete_profile: "Delete Profile",
  home_delete_workspace: "Delete Workspace",
  home_delete_confirm:
    "Are you sure you want to delete your profile and all data? This cannot be undone.",
  home_workspace_cleared: "Your workspace has been cleared.",
  home_profile_updated: "Profile updated successfully!",
  home_welcome_message: "Welcome to DoctorScript!",
  home_error_name_specialty:
    "Please enter your Name and Specialty to set up your workspace.",
  home_error_save_profile: "Failed to save practitioner profile.",
  home_error_delete: "Failed to delete workspace.",
  home_error_export: "Failed to export data",
  home_change_language: "Change Language",
  home_name_placeholder: "e.g. Dr. Jane Smith",
  home_specialty_placeholder: "e.g. General Practice",
  home_license_placeholder: "e.g. MSP-9831",
  home_phone_placeholder: "+1 (555) 000-0000",
  home_email_placeholder: "name@example.com",
  home_registered_patients: "Registered patients",
  home_prescriptions_today: "Prescriptions today",
  home_prescriptions_total: "Total prescriptions",
  home_most_prescribed_medicine: "Most prescribed medicine",
  home_none: "None",
  home_error_single_doctor: "Only one doctor can be registered on this device.",

  // Auth
  auth_password: "Password",
  auth_password_placeholder: "Enter password",
  auth_password_required: "Please create a password to continue.",
  auth_email_required: "Please enter your email to continue.",
  auth_password_edit_hint: "Leave blank to keep your current password.",
  auth_logout: "Logout",
  auth_logged_out: "Logged out successfully.",
  auth_enter_password: "Please enter your password.",
  auth_invalid_password: "Incorrect password.",
  auth_unlock: "Unlock",
  auth_unlock_title: "Session Locked",
  auth_unlock_subtitle: "Enter your password to continue.",
  auth_set_password_before_logout:
    "Set a password first in Edit Profile before logging out.",
  auth_password_missing:
    "No password is set for this doctor yet. Return and set one in Edit Profile.",
  auth_back_home: "Back to Home",
  auth_forgot_password: "Forgot password? Recover via email",
  auth_recovery_email_placeholder: "Enter your registered email",
  auth_recover_via_email: "Send Recovery Email",
  auth_recovery_sent:
    "Recovery email draft opened. Send it from your email app.",
  auth_recovery_missing_email:
    "No email is registered for this doctor profile.",
  auth_recovery_email_mismatch:
    "Email does not match the registered doctor email.",
  auth_recovery_missing_password:
    "No password is currently set for this doctor.",
  auth_recovery_open_failed: "Could not open email app for password recovery.",

  // About & Guide
  about_back: "Back",
  about_title: "About DoctorScript",
  about_subtitle: "Practical prescribing support for clinics",
  about_tab_about: "About",
  about_tab_guide: "User Guide",
  about_created_by: "Created by TimorApps",
  about_description:
    "DoctorScript helps clinicians register patients, issue digital prescriptions, and manage records quickly.",
  about_features:
    "Core features: multilingual interface, patient management, prescription generation, export options, and app lock.",
  about_privacy:
    "Data is stored locally on your device. Protect your device and app password for confidentiality.",
  guide_step_1_title: "1. Register your profile",
  guide_step_1_desc:
    "Enter your practitioner details, set your password, and save your digital signature.",
  guide_step_2_title: "2. Add patients",
  guide_step_2_desc:
    "Open Patients tab to register patient name, date of birth, and phone number.",
  guide_step_3_title: "3. Create prescriptions",
  guide_step_3_desc:
    "Open Prescriptions tab, choose a patient, add medicines and dosage instructions, then save.",
  guide_step_4_title: "4. Export and secure",
  guide_step_4_desc:
    "Use export options for files, logout when needed, and the app will require password after idle timeout.",
  guide_step_5_title: "5. Save as app (Add to Home Screen)",
  guide_step_5_desc_1:
    "On Android Chrome: open browser menu (three dots) and tap Add to Home screen.",
  guide_step_5_desc_2:
    "On iPhone Safari: tap Share button, then choose Add to Home Screen.",
  guide_step_5_desc_3:
    "After adding, launch DoctorScript from your home screen like a native app.",

  // Help tab
  help_reference: "Quick Reference",
  help_title: "Prescription Latin Terms",
  help_subtitle:
    "Common Latin terms and abbreviations used in medical prescriptions.",
  help_search_placeholder: "Search by Latin term, abbreviation, or meaning",
  help_results_count: "{{count}} terms found",
  help_no_results: "No matching terms found.",

  // Patients Screen
  patients_clinical_intake: "Clinical Intake",
  patients_new_profile: "New Patient Profile",
  patients_profile_desc:
    "Enter patient information with precision. All fields are required for clinical records.",
  patients_full_name: "Full Name",
  patients_dob: "Date of Birth (YYYY-MM-DD)",
  patients_phone: "Phone Number",
  patients_save: "Save Patient",
  patients_profiles_title: "Patient Profiles",
  patients_error_fields: "Please fill all fields",
  patients_success_registered: "Patient registered successfully",
  patients_error_register: "Failed to register patient",
  patients_dob_label: "DOB:",
  patients_phone_label: "Phone:",
  patients_name_placeholder: "e.g. Jonathan Doe",
  patients_dob_placeholder: "2000-01-01",
  patients_phone_placeholder: "+1 (555) 000-0000",

  // Prescriptions Screen
  rx_back: "Back to List",
  rx_new: "New Prescription",
  rx_select_patient: "Select Patient",
  rx_age: "Age: {{age}} years old",
  rx_phone: "Phone:",
  rx_attending_doctor: "Attending Doctor",
  rx_clinical_notes: "Clinical Notes",
  rx_notes_placeholder: "Add condition notes...",
  rx_medications: "Medications",
  rx_med_name: "Medication Name",
  rx_dosage_placeholder: "Dosage (e.g. 500mg)",
  rx_freq_placeholder: "Frequency (e.g. 2x a day)",
  rx_duration_placeholder: "Duration (e.g. 7 days)",
  rx_add_medication: "+ Add Another Medication",
  rx_create: "Create Prescription",
  rx_title: "Prescription",
  rx_patient_details: "Patient Details",
  rx_name_label: "Name:",
  rx_phone_label: "Phone:",
  rx_date_label: "Prescription Date:",
  rx_clinical_overview: "Clinical Overview",
  rx_recent: "Recent Prescriptions",
  rx_overview_desc:
    "Manage medical scripts and access patient active treatments.",
  rx_practitioner: "Practitioner",
  rx_date: "Date",
  rx_save_pdf: "Save as PDF",
  rx_save_image: "Save as Image",
  rx_empty:
    "No prescriptions created yet. Click the + button at the top to issue the first prescription.",
  rx_error_select: "Please select a patient.",
  rx_error_save: "Failed to save prescription",
  rx_success_created: "Prescription created successfully",
  rx_error_pdf: "Failed to generate PDF",
  rx_error_photo: "Failed to save photo",
  rx_image_saved: "Image saved to gallery",
  rx_qty: "Qty:",
  rx_sig: "Sig:",
  rx_years_old: "years old",

  // Language
  lang_select: "Select Language",
  lang_en: "English",
  lang_tet: "Tetum",
  lang_pt: "Português",
  lang_id: "Indonesia",
};

export default en;
