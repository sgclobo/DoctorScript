import { IconSymbol } from "@/components/ui/icon-symbol";
import i18n, { SUPPORTED_LANGUAGES } from "@/i18n";
import { hasDoctorPassword, setAppLocked } from "@/services/auth";
import { getDB } from "@/services/database";
import { setStoredLanguage } from "@/services/language";
import { Doctor } from "@/types/schema";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form states for first-time doctor registration
  const [docName, setDocName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [signatureUri, setSignatureUri] = useState("");

  // Snapshot stats
  const [patientCount, setPatientCount] = useState(0);
  const [todayPrescriptionCount, setTodayPrescriptionCount] = useState(0);
  const [totalPrescriptionCount, setTotalPrescriptionCount] = useState(0);
  const [topMedication, setTopMedication] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const pickSignature = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        aspect: [16, 9],
        quality: 0.5,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64Str = result.assets[0].base64;
        if (base64Str) {
          setSignatureUri(`data:image/jpeg;base64,${base64Str}`);
        } else {
          setSignatureUri(result.assets[0].uri);
        }
      }
    } catch (e) {
      console.log("Error picking signature:", e);
      Alert.alert(t("error"), "Could not open photo library");
    }
  };

  const fetchData = async () => {
    try {
      const db = await getDB();
      const docs = await db.getAllAsync<Doctor>(
        "SELECT * FROM doctors ORDER BY id ASC LIMIT 1;",
      );
      if (docs.length > 0) {
        setDoctor(docs[0]);
      } else {
        setDoctor(null);
      }

      const pCount = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM patients;",
      );
      setPatientCount(pCount?.count ?? 0);

      const today = new Date().toISOString().split("T")[0];
      const todayCount = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM prescriptions WHERE date = ?;",
        today,
      );
      setTodayPrescriptionCount(todayCount?.count ?? 0);

      const totalRx = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM prescriptions;",
      );
      setTotalPrescriptionCount(totalRx?.count ?? 0);

      const topMed = await db.getFirstAsync<{ name: string; count: number }>(
        "SELECT name, COUNT(*) as count FROM medications GROUP BY name ORDER BY count DESC, name ASC LIMIT 1;",
      );
      setTopMedication(topMed?.name ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterDoctor = async () => {
    if (!docName || !email || !specialty) {
      Alert.alert(t("error"), t("auth_email_required"));
      return;
    }

    if (!isEditing && !password.trim()) {
      Alert.alert(t("error"), t("auth_password_required"));
      return;
    }

    try {
      const db = await getDB();
      if (doctor && isEditing) {
        if (password.trim()) {
          await db.runAsync(
            "UPDATE doctors SET name=?, email=?, license_number=?, specialty=?, phone=?, signature=?, password=? WHERE id=?",
            docName,
            email,
            license,
            specialty,
            phone,
            signatureUri,
            password,
            doctor.id,
          );
        } else {
          await db.runAsync(
            "UPDATE doctors SET name=?, email=?, license_number=?, specialty=?, phone=?, signature=? WHERE id=?",
            docName,
            email,
            license,
            specialty,
            phone,
            signatureUri,
            doctor.id,
          );
        }

        setDoctor({
          ...doctor,
          name: docName,
          email,
          license_number: license,
          specialty,
          phone,
          signature: signatureUri,
          password: password.trim() ? password : doctor.password,
        });
        setPassword("");
        setIsEditing(false);
        Alert.alert(t("success"), t("home_profile_updated"));
      } else {
        const count = await db.getFirstAsync<{ count: number }>(
          "SELECT COUNT(*) as count FROM doctors",
        );

        if ((count?.count ?? 0) > 0) {
          Alert.alert(t("error"), t("home_error_single_doctor"));
          await fetchData();
          return;
        }

        const result = await db.runAsync(
          "INSERT INTO doctors (name, email, license_number, specialty, phone, signature, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
          docName,
          email,
          license,
          specialty,
          phone,
          signatureUri,
          password,
        );

        setDoctor({
          id: result.lastInsertRowId,
          name: docName,
          email,
          license_number: license,
          specialty,
          phone,
          signature: signatureUri,
          password,
        });
        setPassword("");
        Alert.alert(t("success"), t("home_welcome_message"));
      }
    } catch (e) {
      console.error(e);
      Alert.alert(t("error"), t("home_error_save_profile"));
    }
  };

  const showLanguagePicker = () => setLangPickerVisible(true);

  const handleLogout = async () => {
    const canLock = await hasDoctorPassword();
    if (!canLock) {
      Alert.alert(t("error"), t("auth_set_password_before_logout"));
      setDocName(doctor?.name || "");
      setEmail(doctor?.email || "");
      setSpecialty(doctor?.specialty || "");
      setLicense(doctor?.license_number || "");
      setPhone(doctor?.phone || "");
      setSignatureUri(doctor?.signature || "");
      setIsEditing(true);
      return;
    }
    await setAppLocked(true);
    router.replace("/lock");
  };

  const showProfileMenu = () => setMenuVisible(true);

  const confirmDelete = () => {
    setMenuVisible(false);
    setDeleteConfirmVisible(true);
  };

  const performDelete = async () => {
    try {
      const db = await getDB();
      await db.runAsync("DELETE FROM medications");
      await db.runAsync("DELETE FROM prescriptions");
      await db.runAsync("DELETE FROM patients");
      await db.runAsync("DELETE FROM doctors");
      await db.runAsync(
        "DELETE FROM settings WHERE key IN ('app_locked', 'last_background_at')",
      );

      setDoctor(null);
      setIsEditing(false);
      setPatientCount(0);
      setTodayPrescriptionCount(0);
      setTotalPrescriptionCount(0);
      setTopMedication(null);
      setDocName("");
      setEmail("");
      setSpecialty("");
      setLicense("");
      setPhone("");
      setPassword("");
      setSignatureUri("");
      Alert.alert(t("delete"), t("home_workspace_cleared"));
    } catch (e) {
      console.error(e);
      Alert.alert(t("error"), t("home_error_delete"));
    }
  };

  const exportCSV = async () => {
    try {
      const db = await getDB();
      const patients = await db.getAllAsync("SELECT * FROM patients");
      const prescriptions = await db.getAllAsync("SELECT * FROM prescriptions");

      let csv = "--- Patients ---\nID,Name,DOB,Phone\n";
      patients.forEach((p: any) => {
        csv += `${p.id},"${p.name}","${p.dob}","${p.phone}"\n`;
      });

      csv += "\n--- Prescriptions ---\nID,Patient ID,Doctor ID,Date,Notes\n";
      prescriptions.forEach((r: any) => {
        csv += `${r.id},${r.patient_id},${r.doctor_id},"${r.date}","${r.notes || ""}"\n`;
      });

      const uri =
        (FileSystem as any).cacheDirectory + "DoctorScript_Export.csv";
      await (FileSystem as any).writeAsStringAsync(uri, csv, {
        encoding: (FileSystem as any).EncodingType.UTF8,
      });
      if (Platform.OS === "ios" || Platform.OS === "android") {
        await Sharing.shareAsync(uri, {
          mimeType: "text/csv",
          dialogTitle: "Export Data",
        });
      }
    } catch (e) {
      Alert.alert(t("error"), t("home_error_export"));
    }
  };

  const langPickerModal = (
    <Modal
      visible={langPickerVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setLangPickerVisible(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setLangPickerVisible(false)}
        />
        <View className="bg-surface rounded-t-2xl p-6 pb-12">
          <Text className="font-display font-bold text-xl text-on_surface mb-6 text-center">
            {t("lang_select")}
          </Text>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              className="py-4 border-b border-outline_variant items-center"
              onPress={async () => {
                await i18n.changeLanguage(lang.code);
                await setStoredLanguage(lang.code);
                setLangPickerVisible(false);
              }}
            >
              <Text className="text-on_surface text-base font-medium">
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className="mt-4 py-4 items-center"
            onPress={() => setLangPickerVisible(false)}
          >
            <Text className="text-secondary font-medium">{t("cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const profileMenuModal = (
    <Modal
      visible={menuVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        />
        <View className="bg-surface rounded-t-2xl p-6 pb-12">
          <Text className="font-display font-bold text-xl text-on_surface mb-1 text-center">
            {t("home_profile_options")}
          </Text>
          <Text className="text-secondary text-sm text-center mb-6">
            {t("home_manage_workspace")}
          </Text>
          <TouchableOpacity
            className="py-4 border-b border-outline_variant items-center"
            onPress={() => {
              setMenuVisible(false);
              setDocName(doctor?.name || "");
              setEmail(doctor?.email || "");
              setSpecialty(doctor?.specialty || "");
              setLicense(doctor?.license_number || "");
              setPhone(doctor?.phone || "");
              setSignatureUri(doctor?.signature || "");
              setPassword("");
              setIsEditing(true);
            }}
          >
            <Text className="text-on_surface text-base font-medium">
              {t("home_edit_profile")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-4 border-b border-outline_variant items-center"
            onPress={() => {
              setMenuVisible(false);
              exportCSV();
            }}
          >
            <Text className="text-on_surface text-base font-medium">
              {t("home_export_csv")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-4 border-b border-outline_variant items-center"
            onPress={() => {
              setMenuVisible(false);
              setLangPickerVisible(true);
            }}
          >
            <Text className="text-on_surface text-base font-medium">
              {t("home_change_language")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-4 border-b border-outline_variant items-center"
            onPress={() => {
              setMenuVisible(false);
              handleLogout();
            }}
          >
            <Text className="text-on_surface text-base font-medium">
              {t("auth_logout")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-4 border-b border-outline_variant items-center"
            onPress={confirmDelete}
          >
            <Text className="text-error text-base font-medium">
              {t("home_delete_profile")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-4 py-4 items-center"
            onPress={() => setMenuVisible(false)}
          >
            <Text className="text-secondary font-medium">{t("cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const deleteConfirmModal = (
    <Modal
      visible={deleteConfirmVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setDeleteConfirmVisible(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <View className="bg-surface rounded-2xl p-6">
          <Text className="font-display font-bold text-xl text-on_surface mb-2 text-center">
            {t("home_delete_workspace")}
          </Text>
          <Text className="text-secondary text-sm text-center mb-6">
            {t("home_delete_confirm")}
          </Text>
          <TouchableOpacity
            className="bg-error py-4 rounded-lg items-center mb-3"
            onPress={() => {
              setDeleteConfirmVisible(false);
              performDelete();
            }}
          >
            <Text className="font-display font-bold text-white">
              {t("delete")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-4 items-center"
            onPress={() => setDeleteConfirmVisible(false)}
          >
            <Text className="text-secondary font-medium">{t("cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return <SafeAreaView className="flex-1 bg-surface" />;
  }

  if (!doctor || isEditing) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
          <View className="flex-row items-center">
            <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
            <Text className="text-xl font-display font-extrabold text-primary ml-3">
              DoctorScript
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-surface_container_high items-center justify-center"
              onPress={() => router.push("/about")}
            >
              <IconSymbol name="info.circle.fill" size={20} color="#00488d" />
            </TouchableOpacity>
            {!isEditing && (
              <TouchableOpacity
                className="px-3 py-2 rounded-lg bg-surface_container_high"
                onPress={showLanguagePicker}
              >
                <Text className="text-primary text-xs font-bold">
                  {t("home_change_language")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView contentContainerClassName="p-6 pb-24">
          <View className="mb-8 items-center">
            <Text className="text-primary font-bold tracking-wider text-xs uppercase mb-1 text-center">
              {isEditing ? t("home_edit_profile") : t("home_welcome_setup")}
            </Text>
            <Text className="font-display text-4xl font-extrabold text-on_surface leading-tight mb-2 text-center">
              {t("home_practitioner_profile")}
            </Text>
            <Text className="text-on_surface_variant leading-relaxed text-base text-center">
              {isEditing ? t("home_edit_desc") : t("home_setup_desc")}
            </Text>
          </View>

          <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant space-y-6 shadow-sm">
            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">
                {t("home_full_name")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder={t("home_name_placeholder")}
                placeholderTextColor="#727783"
                value={docName}
                onChangeText={setDocName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">
                {t("home_specialty")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder={t("home_specialty_placeholder")}
                placeholderTextColor="#727783"
                value={specialty}
                onChangeText={setSpecialty}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">
                {t("home_license")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder={t("home_license_placeholder")}
                placeholderTextColor="#727783"
                value={license}
                onChangeText={setLicense}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">
                {t("home_email")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder={t("home_email_placeholder")}
                placeholderTextColor="#727783"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">
                {t("home_contact_phone")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder={t("home_phone_placeholder")}
                placeholderTextColor="#727783"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">
                {t("auth_password")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder={t("auth_password_placeholder")}
                placeholderTextColor="#727783"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {isEditing && (
                <Text className="text-xs text-on_surface_variant mt-2">
                  {t("auth_password_edit_hint")}
                </Text>
              )}
            </View>

            <View className="mb-8">
              <Text className="text-xs font-bold text-on_surface_variant tracking-wide mb-2 uppercase">
                {t("home_digital_signature")}
              </Text>
              <TouchableOpacity
                onPress={pickSignature}
                className="w-full bg-surface_container_low border border-dashed border-outline p-6 rounded-lg items-center justify-center"
              >
                {signatureUri ? (
                  <Image
                    source={{ uri: signatureUri }}
                    style={{ width: "100%", height: 80 }}
                    resizeMode="contain"
                  />
                ) : (
                  <View className="items-center">
                    <IconSymbol name="signature" size={32} color="#727783" />
                    <Text className="text-on_surface_variant mt-2 font-medium">
                      {t("home_upload_signature")}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-4">
              {isEditing && (
                <TouchableOpacity
                  className="flex-1 bg-surface_container_highest py-4 rounded-lg items-center shadow-sm"
                  onPress={() => {
                    setPassword("");
                    setIsEditing(false);
                  }}
                >
                  <Text className="font-display font-bold text-on_surface text-base">
                    {t("cancel")}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="flex-1 bg-primary py-4 rounded-lg items-center shadow-lg"
                onPress={handleRegisterDoctor}
              >
                <Text className="font-display font-bold text-white text-base">
                  {isEditing
                    ? t("home_save_changes")
                    : t("home_complete_setup")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {langPickerModal}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <ScrollView contentContainerClassName="pb-24">
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
          <View className="flex-row items-center gap-3">
            <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
            <Text className="text-xl font-display font-extrabold text-primary">
              DoctorScript
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-surface_container_high items-center justify-center"
              onPress={() => router.push("/about")}
            >
              <IconSymbol name="info.circle.fill" size={20} color="#00488d" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-surface_container_high items-center justify-center"
              onPress={showProfileMenu}
            >
              <IconSymbol
                name="person.crop.circle.fill"
                size={24}
                color="#424752"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 py-8">
          <View className="relative overflow-hidden rounded-xl bg-primary p-6 mb-8">
            <View className="relative z-10 items-center">
              <Text className="text-3xl font-display font-extrabold text-white mb-2 text-center">
                {t("home_welcome_back", { name: doctor.name })}
              </Text>
              <Text className="text-white text-base leading-relaxed opacity-90 text-center">
                {t("home_hero_desc")}
              </Text>
            </View>
          </View>

          <View className="mb-8 gap-4">
            <TouchableOpacity
              className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant flex-row items-center shadow-sm"
              onPress={() => router.push("/patients")}
            >
              <View className="w-12 h-12 rounded-full bg-primary_container items-center justify-center mr-4">
                <IconSymbol
                  name="person.fill.badge.plus"
                  size={24}
                  color="#ffffff"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-display font-bold text-on_surface mb-1">
                  {t("tab_patients")}
                </Text>
                <Text className="text-on_surface_variant text-sm">
                  {t("home_manage_patients")}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#00488d" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant flex-row items-center shadow-sm"
              onPress={() => router.push("/prescriptions")}
            >
              <View className="w-12 h-12 rounded-full bg-secondary_container items-center justify-center mr-4">
                <IconSymbol name="doc.text.fill" size={24} color="#00488d" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-display font-bold text-on_surface mb-1">
                  {t("tab_prescriptions")}
                </Text>
                <Text className="text-on_surface_variant text-sm">
                  {t("home_manage_prescriptions")}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#4c5f7d" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface_container_high rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-display font-bold mb-4 text-on_surface text-center">
              {t("home_today_snapshot")}
            </Text>

            <View className="gap-4">
              <View className="flex-row justify-between border-b border-outline_variant pb-3">
                <Text className="text-sm font-bold text-on_surface_variant">
                  {t("home_registered_patients")}
                </Text>
                <Text className="text-sm font-bold text-on_surface">
                  {patientCount}
                </Text>
              </View>

              <View className="flex-row justify-between border-b border-outline_variant pb-3">
                <Text className="text-sm font-bold text-on_surface_variant">
                  {t("home_prescriptions_today")}
                </Text>
                <Text className="text-sm font-bold text-on_surface">
                  {todayPrescriptionCount}
                </Text>
              </View>

              <View className="flex-row justify-between border-b border-outline_variant pb-3">
                <Text className="text-sm font-bold text-on_surface_variant">
                  {t("home_prescriptions_total")}
                </Text>
                <Text className="text-sm font-bold text-on_surface">
                  {totalPrescriptionCount}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-sm font-bold text-on_surface_variant">
                  {t("home_most_prescribed_medicine")}
                </Text>
                <Text className="text-sm font-bold text-on_surface max-w-[55%] text-right">
                  {topMedication ?? t("home_none")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {langPickerModal}
      {profileMenuModal}
      {deleteConfirmModal}
    </SafeAreaView>
  );
}
