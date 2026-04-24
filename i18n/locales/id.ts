const id = {
  // Common
  cancel: "Batal",
  error: "Kesalahan",
  success: "Berhasil",
  delete: "Hapus",

  // Tabs
  tab_home: "Beranda",
  tab_patients: "Pasien",
  tab_prescriptions: "Resep",
  tab_help: "Bantuan",

  // Home Screen
  home_welcome_setup: "Pengaturan Awal",
  home_edit_profile: "Edit Profil",
  home_practitioner_profile: "Profil Praktisi",
  home_setup_desc:
    "Sepertinya ini pertama kali Anda membuka aplikasi. Silakan masukkan detail Anda di bawah ini agar kami dapat menerbitkan resep atas nama Anda.",
  home_edit_desc:
    "Perbarui detail praktisi dan tanda tangan digital Anda di bawah ini.",
  home_full_name: "Nama Lengkap Anda",
  home_email: "Email",
  home_specialty: "Spesialisasi",
  home_license: "Nomor Lisensi (Opsional)",
  home_contact_phone: "Telepon Kontak (Opsional)",
  home_digital_signature: "Tanda Tangan Digital",
  home_upload_signature: "Unggah Gambar Tanda Tangan",
  home_complete_setup: "Selesaikan Pengaturan",
  home_save_changes: "Simpan Perubahan",
  home_welcome_back: "Selamat datang kembali, {{name}}.",
  home_hero_desc:
    "Kelola ruang klinis Anda dengan presisi. Akses rekam medis pasien, kelola praktisi, dan terbitkan resep digital dari satu dasbor yang aman.",
  home_today_snapshot: "Ringkasan Hari Ini",
  home_patients_stat: "Pasien",
  home_active_drs: "Dokter Aktif",
  home_pharmacy_fulfilment: "Pemenuhan Apotek",
  home_manage_patients: "Kelola profil pasien",
  home_manage_prescriptions: "Lihat dan buat resep",
  home_profile_options: "Opsi Profil",
  home_manage_workspace: "Kelola ruang kerja Anda",
  home_export_csv: "Ekspor Data (CSV)",
  home_delete_profile: "Hapus Profil",
  home_delete_workspace: "Hapus Ruang Kerja",
  home_delete_confirm:
    "Apakah Anda yakin ingin menghapus profil dan semua data Anda? Tindakan ini tidak dapat dibatalkan.",
  home_workspace_cleared: "Ruang kerja Anda telah dihapus.",
  home_profile_updated: "Profil berhasil diperbarui!",
  home_welcome_message: "Selamat datang di DoctorScript!",
  home_error_name_specialty:
    "Harap masukkan Nama dan Spesialisasi untuk mengatur ruang kerja Anda.",
  home_error_save_profile: "Gagal menyimpan profil praktisi.",
  home_error_delete: "Gagal menghapus ruang kerja.",
  home_error_export: "Gagal mengekspor data",
  home_change_language: "Ganti Bahasa",
  home_name_placeholder: "mis. Dr. Siti Rahayu",
  home_specialty_placeholder: "mis. Praktik Umum",
  home_license_placeholder: "mis. SIP-12345",
  home_phone_placeholder: "+62 8xx-xxxx-xxxx",
  home_email_placeholder: "nama@contoh.com",
  home_registered_patients: "Pasien terdaftar",
  home_prescriptions_today: "Resep hari ini",
  home_prescriptions_total: "Total resep",
  home_most_prescribed_medicine: "Obat paling sering diresepkan",
  home_none: "Tidak ada",
  home_error_single_doctor:
    "Hanya satu dokter yang dapat terdaftar di perangkat ini.",

  // Auth
  auth_password: "Kata sandi",
  auth_password_placeholder: "Masukkan kata sandi",
  auth_password_required: "Silakan buat kata sandi untuk melanjutkan.",
  auth_email_required: "Silakan masukkan email untuk melanjutkan.",
  auth_password_edit_hint:
    "Kosongkan jika ingin tetap menggunakan kata sandi saat ini.",
  auth_logout: "Keluar",
  auth_logged_out: "Berhasil keluar.",
  auth_enter_password: "Silakan masukkan kata sandi Anda.",
  auth_invalid_password: "Kata sandi salah.",
  auth_unlock: "Buka",
  auth_unlock_title: "Sesi terkunci",
  auth_unlock_subtitle: "Masukkan kata sandi untuk melanjutkan.",
  auth_set_password_before_logout:
    "Silakan atur kata sandi di Edit Profil sebelum logout.",
  auth_password_missing:
    "Belum ada kata sandi untuk dokter ini. Kembali dan atur di Edit Profil.",
  auth_back_home: "Kembali ke Beranda",
  auth_forgot_password: "Lupa kata sandi? Pulihkan via email",
  auth_recovery_email_placeholder: "Masukkan email terdaftar",
  auth_recover_via_email: "Kirim Email Pemulihan",
  auth_recovery_sent:
    "Draf email pemulihan dibuka. Kirim dari aplikasi email Anda.",
  auth_recovery_missing_email:
    "Belum ada email yang terdaftar untuk profil dokter ini.",
  auth_recovery_email_mismatch:
    "Email tidak cocok dengan email dokter yang terdaftar.",
  auth_recovery_missing_password: "Belum ada kata sandi untuk dokter ini.",
  auth_recovery_open_failed:
    "Tidak dapat membuka aplikasi email untuk pemulihan.",

  // About & Guide
  about_back: "Kembali",
  about_title: "Tentang DoctorScript",
  about_subtitle: "Dukungan resep praktis untuk klinik",
  about_tab_about: "Tentang",
  about_tab_guide: "Panduan Pengguna",
  about_created_by: "Dibuat oleh TimorApps",
  about_description:
    "DoctorScript membantu klinisi mendaftarkan pasien, membuat resep digital, dan mengelola data dengan cepat.",
  about_features:
    "Fitur utama: antarmuka multibahasa, manajemen pasien, pembuatan resep, ekspor data, dan penguncian aplikasi.",
  about_privacy:
    "Data disimpan secara lokal di perangkat Anda. Lindungi perangkat dan kata sandi aplikasi untuk menjaga kerahasiaan.",
  guide_step_1_title: "1. Daftarkan profil Anda",
  guide_step_1_desc:
    "Masukkan detail praktisi, buat kata sandi, dan simpan tanda tangan digital.",
  guide_step_2_title: "2. Tambah pasien",
  guide_step_2_desc:
    "Buka tab Pasien untuk mendaftarkan nama, tanggal lahir, dan nomor telepon.",
  guide_step_3_title: "3. Buat resep",
  guide_step_3_desc:
    "Buka tab Resep, pilih pasien, tambahkan obat dan instruksi dosis, lalu simpan.",
  guide_step_4_title: "4. Ekspor dan amankan",
  guide_step_4_desc:
    "Gunakan opsi ekspor, logout bila perlu, dan aplikasi akan meminta kata sandi setelah idle timeout.",
  guide_step_5_title: "5. Simpan sebagai app (Tambahkan ke Layar Utama)",
  guide_step_5_desc_1:
    "Di Android Chrome: buka menu browser (tiga titik), lalu pilih Tambahkan ke layar utama.",
  guide_step_5_desc_2:
    "Di iPhone Safari: ketuk Bagikan, lalu pilih Tambah ke Layar Utama.",
  guide_step_5_desc_3:
    "Setelah itu, buka DoctorScript dari layar utama seperti aplikasi native.",

  // Help tab
  help_reference: "Referensi Cepat",
  help_title: "Istilah Latin untuk Resep",
  help_subtitle:
    "Istilah Latin dan singkatan yang umum digunakan pada resep medis.",
  help_search_placeholder: "Cari istilah Latin, singkatan, atau arti",
  help_results_count: "{{count}} istilah ditemukan",
  help_no_results: "Tidak ada istilah yang cocok.",

  // Patients Screen
  patients_clinical_intake: "Pendaftaran Klinis",
  patients_new_profile: "Profil Pasien Baru",
  patients_profile_desc:
    "Masukkan informasi pasien dengan tepat. Semua kolom diperlukan untuk catatan klinis.",
  patients_full_name: "Nama Lengkap",
  patients_dob: "Tanggal Lahir (YYYY-MM-DD)",
  patients_phone: "Nomor Telepon",
  patients_save: "Simpan Pasien",
  patients_profiles_title: "Profil Pasien",
  patients_error_fields: "Harap isi semua kolom",
  patients_success_registered: "Pasien berhasil didaftarkan",
  patients_error_register: "Gagal mendaftarkan pasien",
  patients_dob_label: "Tgl. Lahir:",
  patients_phone_label: "Telp:",
  patients_name_placeholder: "mis. Budi Santoso",
  patients_dob_placeholder: "2000-01-01",
  patients_phone_placeholder: "+62 8xx-xxxx-xxxx",

  // Prescriptions Screen
  rx_back: "Kembali ke Daftar",
  rx_new: "Resep Baru",
  rx_select_patient: "Pilih Pasien",
  rx_age: "Usia: {{age}} tahun",
  rx_phone: "Telepon:",
  rx_attending_doctor: "Dokter yang Merawat",
  rx_clinical_notes: "Catatan Klinis",
  rx_notes_placeholder: "Tambahkan catatan kondisi...",
  rx_medications: "Obat-obatan",
  rx_med_name: "Nama Obat",
  rx_dosage_placeholder: "Dosis (mis. 500mg)",
  rx_freq_placeholder: "Frekuensi (mis. 2x sehari)",
  rx_duration_placeholder: "Durasi (mis. 7 hari)",
  rx_add_medication: "+ Tambah Obat Lain",
  rx_create: "Buat Resep",
  rx_title: "Resep Medis",
  rx_patient_details: "Detail Pasien",
  rx_name_label: "Nama:",
  rx_phone_label: "Telepon:",
  rx_date_label: "Tanggal Resep:",
  rx_clinical_overview: "Ikhtisar Klinis",
  rx_recent: "Resep Terbaru",
  rx_overview_desc: "Kelola skrip medis dan akses perawatan aktif pasien.",
  rx_practitioner: "Praktisi",
  rx_date: "Tanggal",
  rx_save_pdf: "Simpan sebagai PDF",
  rx_save_image: "Simpan sebagai Gambar",
  rx_empty:
    "Belum ada resep yang dibuat. Klik tombol + di atas untuk menerbitkan resep pertama.",
  rx_error_select: "Harap pilih pasien.",
  rx_error_save: "Gagal menyimpan resep",
  rx_success_created: "Resep berhasil dibuat",
  rx_error_pdf: "Gagal membuat PDF",
  rx_error_photo: "Gagal menyimpan foto",
  rx_image_saved: "Gambar tersimpan ke galeri",
  rx_qty: "Jml:",
  rx_sig: "Sig:",
  rx_years_old: "tahun",

  // Language
  lang_select: "Pilih Bahasa",
  lang_en: "Inggris",
  lang_tet: "Tetum",
  lang_pt: "Portugis",
  lang_id: "Indonesia",
};

export default id;
