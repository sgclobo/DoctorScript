const pt = {
  // Common
  cancel: "Cancelar",
  error: "Erro",
  success: "Sucesso",
  delete: "Excluir",

  // Tabs
  tab_home: "Início",
  tab_patients: "Pacientes",
  tab_prescriptions: "Receitas",
  tab_help: "Ajuda",

  // Home Screen
  home_welcome_setup: "Configuração Inicial",
  home_edit_profile: "Editar Perfil",
  home_practitioner_profile: "Perfil do Profissional",
  home_setup_desc:
    "Parece que esta é a primeira vez que você abre o aplicativo. Por favor, insira seus dados abaixo para que possamos emitir receitas em seu nome.",
  home_edit_desc:
    "Atualize seus dados profissionais e assinatura digital abaixo.",
  home_full_name: "Seu Nome Completo",
  home_email: "Email",
  home_specialty: "Especialidade",
  home_license: "Número de Licença (Opcional)",
  home_contact_phone: "Telefone de Contato (Opcional)",
  home_digital_signature: "Assinatura Digital",
  home_upload_signature: "Carregar Imagem da Assinatura",
  home_complete_setup: "Concluir Configuração",
  home_save_changes: "Salvar Alterações",
  home_welcome_back: "Bem-vindo(a) de volta, {{name}}.",
  home_hero_desc:
    "Gerencie seu ambiente clínico com precisão. Acesse registros de pacientes, gerencie profissionais e emita receitas digitais a partir de um painel seguro.",
  home_today_snapshot: "Resumo de Hoje",
  home_patients_stat: "Pacientes",
  home_active_drs: "Médicos Ativos",
  home_pharmacy_fulfilment: "Cumprimento Farmácia",
  home_manage_patients: "Gerenciar perfis de pacientes",
  home_manage_prescriptions: "Ver e criar receitas",
  home_profile_options: "Opções de Perfil",
  home_manage_workspace: "Gerenciar seu ambiente",
  home_export_csv: "Exportar Dados (CSV)",
  home_delete_profile: "Excluir Perfil",
  home_delete_workspace: "Excluir Ambiente",
  home_delete_confirm:
    "Tem certeza que deseja excluir seu perfil e todos os dados? Esta ação não pode ser desfeita.",
  home_workspace_cleared: "Seu ambiente foi limpo.",
  home_profile_updated: "Perfil atualizado com sucesso!",
  home_welcome_message: "Bem-vindo ao DoctorScript!",
  home_error_name_specialty:
    "Por favor, insira seu Nome e Especialidade para configurar seu ambiente.",
  home_error_save_profile: "Falha ao salvar perfil do profissional.",
  home_error_delete: "Falha ao excluir ambiente.",
  home_error_export: "Falha ao exportar dados",
  home_change_language: "Mudar Idioma",
  home_name_placeholder: "ex. Dr. João Silva",
  home_specialty_placeholder: "ex. Clínica Geral",
  home_license_placeholder: "ex. CRM-12345",
  home_phone_placeholder: "+55 (11) 9xxxx-xxxx",
  home_email_placeholder: "nome@exemplo.com",
  home_registered_patients: "Pacientes registrados",
  home_prescriptions_today: "Receitas de hoje",
  home_prescriptions_total: "Total de receitas",
  home_most_prescribed_medicine: "Medicamento mais prescrito",
  home_none: "Nenhum",
  home_error_single_doctor:
    "Apenas um médico pode ser registrado neste dispositivo.",

  // Auth
  auth_password: "Senha",
  auth_password_placeholder: "Digite a senha",
  auth_password_required: "Por favor, crie uma senha para continuar.",
  auth_email_required: "Por favor, informe seu email para continuar.",
  auth_password_edit_hint: "Deixe em branco para manter sua senha atual.",
  auth_logout: "Sair",
  auth_logged_out: "Sessão encerrada com sucesso.",
  auth_enter_password: "Por favor, digite sua senha.",
  auth_invalid_password: "Senha incorreta.",
  auth_unlock: "Desbloquear",
  auth_unlock_title: "Sessão bloqueada",
  auth_unlock_subtitle: "Digite sua senha para continuar.",
  auth_set_password_before_logout:
    "Defina uma senha em Editar Perfil antes de sair.",
  auth_password_missing:
    "Ainda não há senha para este médico. Volte e defina em Editar Perfil.",
  auth_back_home: "Voltar ao Início",
  auth_forgot_password: "Esqueceu a senha? Recuperar por email",
  auth_recovery_email_placeholder: "Digite seu email cadastrado",
  auth_recover_via_email: "Enviar Email de Recuperação",
  auth_recovery_sent:
    "Rascunho de recuperação aberto. Envie pelo seu app de email.",
  auth_recovery_missing_email:
    "Nenhum email foi cadastrado para este perfil de médico.",
  auth_recovery_email_mismatch:
    "O email não corresponde ao email cadastrado do médico.",
  auth_recovery_missing_password:
    "Nenhuma senha está definida para este médico.",
  auth_recovery_open_failed:
    "Não foi possível abrir o app de email para recuperação.",

  // About & Guide
  about_back: "Voltar",
  about_title: "Sobre o DoctorScript",
  about_subtitle: "Suporte prático de prescrição para clínicas",
  about_tab_about: "Sobre",
  about_tab_guide: "Guia do Usuário",
  about_created_by: "Criado por TimorApps",
  about_description:
    "O DoctorScript ajuda profissionais a registrar pacientes, emitir receitas digitais e gerenciar registros com rapidez.",
  about_features:
    "Recursos principais: interface multilíngue, gestão de pacientes, criação de receitas, exportação e bloqueio do app.",
  about_privacy:
    "Os dados são armazenados localmente no dispositivo. Proteja seu dispositivo e senha do app para manter a confidencialidade.",
  guide_step_1_title: "1. Cadastre seu perfil",
  guide_step_1_desc:
    "Insira seus dados profissionais, crie sua senha e salve sua assinatura digital.",
  guide_step_2_title: "2. Adicione pacientes",
  guide_step_2_desc:
    "Abra a aba Pacientes para registrar nome, data de nascimento e telefone.",
  guide_step_3_title: "3. Crie receitas",
  guide_step_3_desc:
    "Abra a aba Receitas, selecione um paciente, adicione medicamentos e instruções, depois salve.",
  guide_step_4_title: "4. Exporte e proteja",
  guide_step_4_desc:
    "Use as opções de exportação, faça logout quando necessário e o app pedirá senha após tempo ocioso.",
  guide_step_5_title: "5. Salvar como app (Adicionar à Tela Inicial)",
  guide_step_5_desc_1:
    "No Android Chrome: abra o menu do navegador (três pontos) e toque em Adicionar à tela inicial.",
  guide_step_5_desc_2:
    "No iPhone Safari: toque em Compartilhar e escolha Adicionar à Tela de Início.",
  guide_step_5_desc_3:
    "Depois disso, abra o DoctorScript pela tela inicial como um app nativo.",

  // Help tab
  help_reference: "Referência Rápida",
  help_title: "Termos Latinos em Receitas",
  help_subtitle: "Termos e abreviações latinas comuns em prescrições médicas.",
  help_search_placeholder: "Buscar por termo latino, abreviação ou significado",
  help_results_count: "{{count}} termos encontrados",
  help_no_results: "Nenhum termo correspondente encontrado.",

  // Patients Screen
  patients_clinical_intake: "Admissão Clínica",
  patients_new_profile: "Novo Perfil de Paciente",
  patients_profile_desc:
    "Insira as informações do paciente com precisão. Todos os campos são obrigatórios para os registros clínicos.",
  patients_full_name: "Nome Completo",
  patients_dob: "Data de Nascimento (AAAA-MM-DD)",
  patients_phone: "Número de Telefone",
  patients_save: "Salvar Paciente",
  patients_profiles_title: "Perfis de Pacientes",
  patients_error_fields: "Por favor, preencha todos os campos",
  patients_success_registered: "Paciente registrado com sucesso",
  patients_error_register: "Falha ao registrar paciente",
  patients_dob_label: "Nasc.:",
  patients_phone_label: "Tel.:",
  patients_name_placeholder: "ex. João da Silva",
  patients_dob_placeholder: "2000-01-01",
  patients_phone_placeholder: "+55 (11) 9xxxx-xxxx",

  // Prescriptions Screen
  rx_back: "Voltar à Lista",
  rx_new: "Nova Receita",
  rx_select_patient: "Selecionar Paciente",
  rx_age: "Idade: {{age}} anos",
  rx_phone: "Telefone:",
  rx_attending_doctor: "Médico Responsável",
  rx_clinical_notes: "Notas Clínicas",
  rx_notes_placeholder: "Adicionar notas sobre a condição...",
  rx_medications: "Medicamentos",
  rx_med_name: "Nome do Medicamento",
  rx_dosage_placeholder: "Dosagem (ex.: 500mg)",
  rx_freq_placeholder: "Frequência (ex.: 2x ao dia)",
  rx_duration_placeholder: "Duração (ex.: 7 dias)",
  rx_add_medication: "+ Adicionar Outro Medicamento",
  rx_create: "Criar Receita",
  rx_title: "Receita Médica",
  rx_patient_details: "Dados do Paciente",
  rx_name_label: "Nome:",
  rx_phone_label: "Telefone:",
  rx_date_label: "Data da Receita:",
  rx_clinical_overview: "Visão Geral Clínica",
  rx_recent: "Receitas Recentes",
  rx_overview_desc:
    "Gerencie scripts médicos e acesse tratamentos ativos dos pacientes.",
  rx_practitioner: "Profissional",
  rx_date: "Data",
  rx_save_pdf: "Salvar como PDF",
  rx_save_image: "Salvar como Imagem",
  rx_empty:
    "Nenhuma receita criada ainda. Clique no botão + acima para emitir a primeira receita.",
  rx_error_select: "Por favor, selecione um paciente.",
  rx_error_save: "Falha ao salvar receita",
  rx_success_created: "Receita criada com sucesso",
  rx_error_pdf: "Falha ao gerar PDF",
  rx_error_photo: "Falha ao salvar foto",
  rx_image_saved: "Imagem salva na galeria",
  rx_qty: "Qtd:",
  rx_sig: "Sig:",
  rx_years_old: "anos",

  // Language
  lang_select: "Selecionar Idioma",
  lang_en: "Inglês",
  lang_tet: "Tétum",
  lang_pt: "Português",
  lang_id: "Indonésio",
};

export default pt;
