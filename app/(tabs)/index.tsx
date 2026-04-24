import { IconSymbol } from "@/components/ui/icon-symbol";
import i18n, { SUPPORTED_LANGUAGES } from "@/i18n";
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
  const [specialty, setSpecialty] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [signatureUri, setSignatureUri] = useState("");

  // Stats
  const [patientCount, setPatientCount] = useState(0);
  const [activeDrs, setActiveDrs] = useState(0);

  const pickSignature = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
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
        "SELECT * FROM doctors LIMIT 1;",
      );
      if (docs.length > 0) {
        setDoctor(docs[0]);
      }

      const pCount = await db.getAllAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM patients;",
      );
      if (pCount.length > 0) setPatientCount(pCount[0].count);

      const dCount = await db.getAllAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM doctors;",
      );
      if (dCount.length > 0) setActiveDrs(dCount[0].count);
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
    if (!docName || !specialty) {
      Alert.alert(t("error"), t("home_error_name_specialty"));
      return;
    }

    try {
      const db = await getDB();
      if (doctor && isEditing) {
        await db.runAsync(
          "UPDATE doctors SET name=?, license_number=?, specialty=?, phone=?, signature=? WHERE id=?",
          docName,
          license,
          specialty,
          phone,
          signatureUri,
          doctor.id,
        );
        setDoctor({
          ...doctor,
          name: docName,
          license_number: license,
          specialty: specialty,
          phone: phone,
          signature: signatureUri,
        });
        setIsEditing(false);
        Alert.alert(t("success"), t("home_profile_updated"));
      } else {
        const result = await db.runAsync(
          "INSERT INTO doctors (name, license_number, specialty, phone, signature) VALUES (?, ?, ?, ?, ?)",
          docName,
          license,
          specialty,
          phone,
          signatureUri,
        );

        setDoctor({
          id: result.lastInsertRowId,
          name: docName,
          license_number: license,
          specialty: specialty,
          phone: phone,
          signature: signatureUri,
        });
        setActiveDrs((prev) => prev + 1);
        Alert.alert(t("success"), t("home_welcome_message"));
      }
    } catch (e) {
      console.error(e);
      Alert.alert(t("error"), t("home_error_save_profile"));
    }
  };

  const showLanguagePicker = () => {
    Alert.alert(t("lang_select"), undefined, [
      ...SUPPORTED_LANGUAGES.map((lang) => ({
        text: lang.label,
        onPress: async () => {
          await i18n.changeLanguage(lang.code);
          await setStoredLanguage(lang.code);
        },
      })),
      { text: t("cancel"), style: "cancel" as const },
    ]);
  };

  const showProfileMenu = () => {
    Alert.alert(t("home_profile_options"), t("home_manage_workspace"), [
      {
        text: t("home_edit_profile"),
        onPress: () => {
          setDocName(doctor?.name || "");
          setSpecialty(doctor?.specialty || "");
          setLicense(doctor?.license_number || "");
          setPhone(doctor?.phone || "");
          setSignatureUri(doctor?.signature || "");
          setIsEditing(true);
        },
      },
      { text: t("home_export_csv"), onPress: exportCSV },
      { text: t("home_change_language"), onPress: showLanguagePicker },
      {
        text: t("home_delete_profile"),
        onPress: confirmDelete,
        style: "destructive",
      },
      { text: t("cancel"), style: "cancel" },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert(t("home_delete_workspace"), t("home_delete_confirm"), [
      { text: t("cancel"), style: "cancel" },
      { text: t("delete"), style: "destructive", onPress: performDelete },
    ]);
  };

  const performDelete = async () => {
    try {
      const db = await getDB();
      await db.runAsync("DELETE FROM medications");
      await db.runAsync("DELETE FROM prescriptions");
      await db.runAsync("DELETE FROM patients");
      await db.runAsync("DELETE FROM doctors");
      setDoctor(null);
      setIsEditing(false);
      setPatientCount(0);
      setActiveDrs(0);
      setDocName("");
      setSpecialty("");
      setLicense("");
      setPhone("");
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

  if (loading) {
    return <SafeAreaView className="flex-1 bg-surface" />;
  }

  // --- DOCTOR ONBOARDING (FIRST TIME OPENING APP) ---
  if (!doctor || isEditing) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <View className="px-6 py-4 flex-row items-center border-b border-outline_variant">
          <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
          <Text className="text-xl font-display font-extrabold text-primary ml-3">
            DoctorScript
          </Text>
        </View>
        <ScrollView contentContainerClassName="p-6 pb-24">
          <View className="mb-8">
            <Text className="text-primary font-bold tracking-wider text-xs uppercase mb-1">
              {isEditing ? t("home_edit_profile") : t("home_welcome_setup")}
            </Text>
            <Text className="font-display text-4xl font-extrabold text-on_surface leading-tight mb-2">
              {t("home_practitioner_profile")}
            </Text>
            <Text className="text-on_surface_variant leading-relaxed text-base">
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

            <View className="mb-6">
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
                  onPress={() => setIsEditing(false)}
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
      </SafeAreaView>
    );
  }

  // --- HOME DASHBOARD (DOCTOR EXISTS) ---
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <ScrollView contentContainerClassName="pb-24">
        {/* Top App Bar */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
          <View className="flex-row items-center gap-3">
            <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
            <Text className="text-xl font-display font-extrabold text-primary">
              DoctorScript
            </Text>
          </View>
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

        <View className="px-6 py-8">
          {/* Hero Section */}
          <View className="relative overflow-hidden rounded-xl bg-primary p-6 mb-8">
            <View className="relative z-10">
              <Text className="text-3xl font-display font-extrabold text-white mb-2">
                {t("home_welcome_back", { name: doctor.name })}
              </Text>
              <Text className="text-white text-base leading-relaxed opacity-90">
                {t("home_hero_desc")}
              </Text>
            </View>
          </View>

          {/* Action Grid */}
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

          {/* Stats Panel */}
          <View className="bg-surface_container_high rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-display font-bold mb-4 text-on_surface">
              {t("home_today_snapshot")}
            </Text>

            <View className="flex-row justify-between mb-4 border-b border-outline_variant pb-4">
              <View>
                <Text className="text-xs text-on_surface_variant uppercase font-bold tracking-wider">
                  {t("home_patients_stat")}
                </Text>
                <Text className="text-2xl font-display font-bold text-on_surface mt-1">
                  {patientCount}
                </Text>
              </View>
              <View>
                <Text className="text-xs text-on_surface_variant uppercase font-bold tracking-wider">
                  {t("home_active_drs")}
                </Text>
                <Text className="text-2xl font-display font-bold text-on_surface mt-1">
                  {activeDrs}
                </Text>
              </View>
            </View>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm font-bold text-on_surface">
                  {t("home_pharmacy_fulfilment")}
                </Text>
                <Text className="text-sm font-bold text-tertiary">92%</Text>
              </View>
              <View className="h-2 w-full bg-surface_container_lowest rounded-full overflow-hidden">
                <View className="h-full bg-tertiary" style={{ width: "92%" }} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

