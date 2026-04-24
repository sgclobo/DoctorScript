const tet = {
  // Common
  cancel: "Kansela",
  error: "Erru",
  success: "Susesu",
  delete: "Hasai",

  // Tabs
  tab_home: "Uma",
  tab_patients: "Pasiente Sira",
  tab_prescriptions: "Reseita Sira",
  tab_help: "Ajuda",

  // Home Screen
  home_welcome_setup: "Konfigurasaun Inisiál",
  home_edit_profile: "Edita Perfil",
  home_practitioner_profile: "Perfil Profisionál",
  home_setup_desc:
    "Karik ida nee foin primeira vez itaboot uza aplikasaun ne'e. Hakerek ita-nia detaillu iha okos atu emite reseita iha ita-nia naran.",
  home_edit_desc:
    "Atualiza ita-nia detaillu profisionál no assinatura dijitál iha okos.",
  home_full_name: "Naran Kompletu",
  home_email: "Email",
  home_specialty: "Espesialidade",
  home_license: "Numeru Lisensa (Opsionál)",
  home_contact_phone: "Telefone Kontaktu (Opsionál)",
  home_digital_signature: "Assinatura Dijitál",
  home_upload_signature: "Karrega Imajen Assinatura",
  home_complete_setup: "Kompleta Konfigurasaun",
  home_save_changes: "Rai Mudansa",
  home_welcome_back: "Bem-vindo, {{name}}.",
  home_hero_desc:
    "Jere ita-nia espasu traballu klínika ho presizaun. Asesu registu pasiente, jere profisionálmente, no emite reseita dijitál husi dashboard seguru ida.",
  home_today_snapshot: "Rezumu Ohin",
  home_patients_stat: "Pasiente Sira",
  home_active_drs: "Dotór Ativa",
  home_pharmacy_fulfilment: "Kumpre Farmasia",
  home_manage_patients: "Jere perfil pasiente sira",
  home_manage_prescriptions: "Haree no kria reseita sira",
  home_profile_options: "Opsaun Perfil",
  home_manage_workspace: "Jere ita-nia espasu traballu",
  home_export_csv: "Esporta Dadus (CSV)",
  home_delete_profile: "Hasai Perfil",
  home_delete_workspace: "Hasai Espasu Traballu",
  home_delete_confirm:
    "Ita-boot iha serteza katak hakarak hasai ita-nia perfil no dadus hotu? Bele la desfazer ne'e.",
  home_workspace_cleared: "Ita-nia espasu traballu hetan hakotu ona.",
  home_profile_updated: "Perfil atualiza ho susesu!",
  home_welcome_message: "Bem-vindo ba DoctorScript!",
  home_error_name_specialty:
    "Favor hakerek ita-nia Naran no Espesialidade atu konfigura ita-nia espasu traballu.",
  home_error_save_profile: "La konsege rai perfil profisionál.",
  home_error_delete: "La konsege hasai espasu traballu.",
  home_error_export: "La konsege esporta dadus",
  home_change_language: "Muda Lian",
  home_name_placeholder: "ex. Dr. Jane Smith",
  home_specialty_placeholder: "ex. Prátika Jerál",
  home_license_placeholder: "ex. MSP-9831",
  home_phone_placeholder: "+670 7xx-xxxx",
  home_email_placeholder: "naran@example.com",
  home_registered_patients: "Pasiente rejistadu",
  home_prescriptions_today: "Reseita ohin",
  home_prescriptions_total: "Total reseita",
  home_most_prescribed_medicine: "Medikamentu ne'ebe preskreve liu",
  home_none: "Laiha",
  home_error_single_doctor:
    "Dotór ida deit mak bele rejistu iha aparellu ida-ne'e.",

  // Auth
  auth_password: "Password",
  auth_password_placeholder: "Hatama password",
  auth_password_required: "Favor kria password atu kontinua.",
  auth_email_required: "Favor hatama email atu kontinua.",
  auth_password_edit_hint: "Husik mamuk atu bele uza nafatin password tuan.",
  auth_logout: "Logout",
  auth_logged_out: "Logout ho susesu.",
  auth_enter_password: "Favor hatama ita-nia password.",
  auth_invalid_password: "Password sala.",
  auth_unlock: "Loke",
  auth_unlock_title: "Sessão taka",
  auth_unlock_subtitle: "Hatama password atu kontinua.",
  auth_set_password_before_logout:
    "Favor defini password iha Edita Perfil molok logout.",
  auth_password_missing:
    "Seidauk iha password ba dotór ida-ne'e. Fila no defini iha Edita Perfil.",
  auth_back_home: "Fila ba Uma",
  auth_forgot_password: "Haluha password? Rekupera liu husi email",
  auth_recovery_email_placeholder: "Hatama email rejistadu",
  auth_recover_via_email: "Haruka Email Rekuperasaun",
  auth_recovery_sent:
    "Draft email rekuperasaun loke ona. Haruka husi app email ita-nia.",
  auth_recovery_missing_email:
    "Seidauk rejista email ba perfil dotór ida-ne'e.",
  auth_recovery_email_mismatch:
    "Email la hanesan ho email dotór ne'ebé rejista.",
  auth_recovery_missing_password: "Seidauk iha password ba dotór ida-ne'e.",
  auth_recovery_open_failed: "La konsege loke app email atu rekupera password.",

  // About & Guide
  about_back: "Fila",
  about_title: "Konaba DoctorScript",
  about_subtitle: "Apoiu prátiku ba preskrisaun iha klínika",
  about_tab_about: "Konaba",
  about_tab_guide: "Guia Utilizador",
  about_created_by: "Kria husi TimorApps",
  about_description:
    "DoctorScript ajuda kliniku sira atu rejista pasiente, hasai reseita dijitál no jere registu lalais.",
  about_features:
    "Funsaun prinsipal: interface multilingue, jestaun pasiente, kriasaun reseita, exporta dadus no app lock.",
  about_privacy:
    "Dadus rai lokal iha ita-nia aparellu. Proteje aparellu no password app ba konfidensialidade.",
  guide_step_1_title: "1. Rejista ita-nia perfil",
  guide_step_1_desc:
    "Hatama detaillu profisionál, defini password no rai assinatura dijitál.",
  guide_step_2_title: "2. Aumenta pasiente",
  guide_step_2_desc:
    "Loke aba Pasiente atu rejista naran, data moris no numeru telefone.",
  guide_step_3_title: "3. Kria reseita",
  guide_step_3_desc:
    "Loke aba Reseita, hili pasiente, hatama medikamentu no instrusaun dosajen, depois rai.",
  guide_step_4_title: "4. Exporta no seguru",
  guide_step_4_desc:
    "Uza opsaun exporta, logout bainhira presiza, no app sei husu password depois idle timeout.",
  guide_step_5_title: "5. Rai hanesan app (Add to Home Screen)",
  guide_step_5_desc_1:
    "Iha Android Chrome: loke menu browser (pontu tolu) no hili Add to Home screen.",
  guide_step_5_desc_2:
    "Iha iPhone Safari: klik Share, depois hili Add to Home Screen.",
  guide_step_5_desc_3:
    "Depois aumenta ona, loke DoctorScript husi home screen hanesan app nativu.",

  // Help tab
  help_reference: "Referénsia Rapidu",
  help_title: "Termu Latin ba Reseita",
  help_subtitle:
    "Termu Latin komun no abreviatura ne'ebé uza iha preskrisaun médika.",
  help_search_placeholder: "Buka termu Latin, abreviatura, ka signifikadu",
  help_results_count: "Termu {{count}} hetan",
  help_no_results: "La iha termu ne'ebé hanesan.",

  // Patients Screen
  patients_clinical_intake: "Admisaun Klínika",
  patients_new_profile: "Perfil Pasiente Foun",
  patients_profile_desc:
    "Hakerek informasaun pasiente ho presizaun. Kampu hotu nesesáriu ba registu klíniku.",
  patients_full_name: "Naran Kompletu",
  patients_dob: "Data Moris (YYYY-MM-DD)",
  patients_phone: "Numeru Telefone",
  patients_save: "Rai Pasiente",
  patients_profiles_title: "Perfil Pasiente Sira",
  patients_error_fields: "Favor preenxe kampu hotu",
  patients_success_registered: "Pasiente rejistu ho susesu",
  patients_error_register: "La konsege rejistu pasiente",
  patients_dob_label: "D. Moris:",
  patients_phone_label: "Telemóvel:",
  patients_name_placeholder: "ex. João da Silva",
  patients_dob_placeholder: "2000-01-01",
  patients_phone_placeholder: "+670 7xx-xxxx",

  // Prescriptions Screen
  rx_back: "Fila Ba Lista",
  rx_new: "Reseita Foun",
  rx_select_patient: "Hili Pasiente",
  rx_age: "Tinan: {{age}} tinan",
  rx_phone: "Telemóvel:",
  rx_attending_doctor: "Dotór Ne'ebé Atende",
  rx_clinical_notes: "Nota Klínika",
  rx_notes_placeholder: "Aumenta nota kondisaun...",
  rx_medications: "Medikamentu Sira",
  rx_med_name: "Naran Medikamentu",
  rx_dosage_placeholder: "Dóze (ex. 500mg)",
  rx_freq_placeholder: "Frekuénsia (ex. 2x loron-loron)",
  rx_duration_placeholder: "Durasaun (ex. loron 7)",
  rx_add_medication: "+ Aumenta Medikamentu Seluk",
  rx_create: "Kria Reseita",
  rx_title: "Reseita",
  rx_patient_details: "Dadus Pasiente",
  rx_name_label: "Naran:",
  rx_phone_label: "Telemóvel:",
  rx_date_label: "Data Reseita:",
  rx_clinical_overview: "Vizualizasaun Klínika",
  rx_recent: "Reseita Sira Ikus",
  rx_overview_desc:
    "Jere script médiku no asesu tratamentu ativa pasiente sira.",
  rx_practitioner: "Profisionál",
  rx_date: "Data",
  rx_save_pdf: "Rai hanesan PDF",
  rx_save_image: "Rai hanesan Imajen",
  rx_empty:
    "Seidauk iha reseita kria. Klika botão + iha leten atu emite reseita dahuluk.",
  rx_error_select: "Favor hili pasiente ida.",
  rx_error_save: "La konsege rai reseita",
  rx_success_created: "Reseita kria ho susesu",
  rx_error_pdf: "La konsege jera PDF",
  rx_pdf_generated: "Reseita PDF jera ho susesu",
  rx_error_photo: "La konsege rai foto",
  rx_image_saved: "Imajen rai ba galeria",
  rx_qty: "Qty:",
  rx_sig: "Sig:",
  rx_years_old: "tinan",

  // Language
  lang_select: "Hili Lian",
  lang_en: "Inglés",
  lang_tet: "Tetun",
  lang_pt: "Portugés",
  lang_id: "Indonéziu",
};

export default tet;
