import { IconSymbol } from "@/components/ui/icon-symbol";
import { getDB } from "@/services/database";
import { Doctor, Medication, Patient } from "@/types/schema";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
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
import ViewShot from "react-native-view-shot";

export default function PrescriptionsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<Partial<Medication>[]>([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  // Detail State
  const [detailData, setDetailData] = useState<any>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const fetchData = async () => {
    try {
      const db = await getDB();
      const rxResult = await db.getAllAsync(`
        SELECT p.*, pat.name as patient_name, pat.phone as patient_phone, pat.dob as patient_dob, doc.name as doctor_name 
        FROM prescriptions p
        JOIN patients pat ON p.patient_id = pat.id
        JOIN doctors doc ON p.doctor_id = doc.id
        ORDER BY p.id DESC;
      `);
      setPrescriptions(rxResult);

      const ptResult = await db.getAllAsync<Patient>("SELECT * FROM patients;");
      setPatients(ptResult);

      const docResult = await db.getAllAsync<Doctor>(
        "SELECT * FROM doctors LIMIT 1;",
      );
      if (docResult.length > 0) setDoctor(docResult[0]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSavePrescription = async () => {
    if (!selectedPatientId || !doctor) {
      Alert.alert(t("error"), t("rx_error_select"));
      return;
    }

    try {
      const db = await getDB();
      const date = new Date().toISOString().split("T")[0];
      const result = await db.runAsync(
        "INSERT INTO prescriptions (patient_id, doctor_id, date, notes) VALUES (?, ?, ?, ?)",
        selectedPatientId,
        doctor.id,
        date,
        notes,
      );

      const rxId = result.lastInsertRowId;

      for (const med of medications) {
        if (med.name) {
          await db.runAsync(
            "INSERT INTO medications (prescription_id, name, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?)",
            rxId,
            med.name,
            med.dosage || "",
            med.frequency || "",
            med.duration || "",
          );
        }
      }

      Alert.alert(t("success"), t("rx_success_created"));
      setView("list");
      setSelectedPatientId(null);
      setNotes("");
      setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
    } catch (e) {
      console.error(e);
      Alert.alert(t("error"), t("rx_error_save"));
    }
  };

  const openDetail = async (rxInfo: any) => {
    try {
      const db = await getDB();
      const meds = await db.getAllAsync(
        "SELECT * FROM medications WHERE prescription_id = ?",
        rxInfo.id,
      );
      setDetailData({ ...rxInfo, medications: meds });
      setView("detail");
    } catch (e) {
      console.error(e);
    }
  };

  const addMedicationRow = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string,
  ) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const removeMedicationRow = (index: number) => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  const exportPDF = async () => {
    if (!detailData) return;

    const patientNameSafe = detailData.patient_name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .slice(0, 30);
    const filename = `Rx-${patientNameSafe}-${detailData.date}.pdf`;

    const medRows = detailData.medications
      .map(
        (m: any) => `
      <div style="margin-bottom: 12px; padding-left: 10px; border-left: 4px solid #6099f0;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #00488d;">
          <span style="font-family: serif; font-style: italic; margin-right: 4px;">R/</span>${m.name}
        </p>
        ${m.dosage ? `<p style="margin: 2px 0 0 24px; font-size: 14px; color: #333;">${t("rx_qty")} ${m.dosage}</p>` : ""}
        ${m.frequency || m.duration ? `<p style="margin: 2px 0 0 24px; font-size: 14px; color: #333;">${t("rx_sig")} ${m.frequency}${m.duration ? `, ${m.duration}` : ""}</p>` : ""}
      </div>
    `,
      )
      .join("");

    let sigImg = "";
    if (doctor?.signature) {
      sigImg = `<img src="${doctor.signature}" style="max-width: 150px; max-height: 80px; object-fit: contain; margin-bottom: 8px;" />`;
    }

    const html = `
      <html>
        <body style="font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #181c1f;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #00488d; padding-bottom: 16px; margin-bottom: 20px;">
            <div style="font-size: 60px; color: #00488d; font-weight: bold; font-family: serif; line-height: 1;">℞</div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #00488d;">${doctor?.name || detailData.doctor_name}${doctor?.specialty ? ", " + doctor.specialty : ""}</p>
              ${doctor?.phone ? `<p style="margin: 4px 0 0; font-size: 14px; color: #555;">${doctor.phone}</p>` : ""}
            </div>
          </div>
          
          <h2 style="font-size: 20px; color: #333; margin-bottom: 24px;">${t("rx_title")}</h2>
          
          <div style="margin-bottom: 40px;">
            ${medRows}
          </div>
          
          <div style="background-color: #eef5fe; padding: 20px; border-radius: 8px; border: 1px solid #d6e5fa; margin-bottom: 60px;">
            <h3 style="margin: 0 0 12px; font-size: 16px; color: #00488d;">${t("rx_patient_details")}</h3>
            <p style="margin: 0 0 4px; font-size: 14px;"><strong>${t("rx_name_label")}</strong> ${detailData.patient_name}, ${calculateAge(detailData.patient_dob)} ${t("rx_years_old")}</p>
            ${detailData.patient_phone ? `<p style="margin: 0 0 4px; font-size: 14px;"><strong>${t("rx_phone_label")}</strong> ${detailData.patient_phone}</p>` : ""}
            <p style="margin: 0; font-size: 14px;"><strong>${t("rx_date_label")}</strong> ${detailData.date}</p>
          </div>
          
          <div style="text-align: right; margin-top: 40px;">
            ${sigImg || '<div style="height: 80px;"></div>'}
            <div style="width: 200px; border-bottom: 1px solid #333; margin-left: auto; margin-bottom: 8px;"></div>
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #333;">${doctor?.name || detailData.doctor_name}${doctor?.specialty ? ", " + doctor.specialty : ""}</p>
            ${doctor?.license_number ? `<p style="margin: 4px 0 0; font-size: 12px; color: #666;">CP N° : ${doctor.license_number}</p>` : ""}
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === "web") {
        // On web, create a download link with proper filename
        const link = document.createElement("a");
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (Platform.OS === "ios" || Platform.OS === "android") {
        const timestamp = new Date().getTime();
        const uniqueNewUri = `${(FileSystem as any).cacheDirectory}${filename.replace(".pdf", "-") + timestamp}.pdf`;
        await (FileSystem as any).copyAsync({ from: uri, to: uniqueNewUri });
        await Sharing.shareAsync(uniqueNewUri, {
          UTI: "com.adobe.pdf",
          mimeType: "application/pdf",
        });
      }
      Alert.alert(t("success"), t("rx_pdf_generated"));
    } catch (error) {
      console.error(error);
      Alert.alert(t("error"), t("rx_error_pdf"));
    }
  };

  const saveToGallery = async () => {
    try {
      if (Platform.OS === "web") {
        // Web: Use html2canvas to capture prescription element and download as image
        try {
          const element = document.querySelector(
            '[style*=\"background-color: white\"]',
          );
          if (element) {
            const canvas = await html2canvas(element as HTMLElement);
            const patientNameSafe = detailData.patient_name
              .replace(/[^a-zA-Z0-9]/g, "_")
              .slice(0, 30);
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/jpeg", 0.9);
            link.download = `Rx-${patientNameSafe}-${detailData.date}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            Alert.alert(t("success"), t("rx_image_saved"));
            return;
          }
        } catch (canvasErr) {
          console.log("Canvas capture failed:", canvasErr);
        }
      }

      // Native (iOS/Android) fallback
      if (viewShotRef.current && (viewShotRef.current as any).capture) {
        const uri = await (viewShotRef.current as any).capture();
        let savedToGallery = false;
        try {
          const permission = await MediaLibrary.requestPermissionsAsync();
          if (permission.granted) {
            await MediaLibrary.saveToLibraryAsync(uri);
            savedToGallery = true;
            Alert.alert(t("success"), t("rx_image_saved"));
          }
        } catch (mediaErr) {
          console.log(
            "MediaLibrary failed, falling back to Sharing:",
            mediaErr,
          );
        }

        if (
          !savedToGallery &&
          (Platform.OS === "ios" || Platform.OS === "android")
        ) {
          const timestamp = new Date().getTime();
          const patientNameSafe = detailData.patient_name
            .replace(/[^a-zA-Z0-9]/g, "_")
            .slice(0, 30);
          const uniqueNewUri = `${(FileSystem as any).cacheDirectory}Rx-${patientNameSafe}-${detailData.date}-${timestamp}.jpg`;
          await (FileSystem as any).copyAsync({
            from: uri,
            to: uniqueNewUri,
          });
          await Sharing.shareAsync(uniqueNewUri, {
            mimeType: "image/jpeg",
            dialogTitle: t("rx_save_image"),
          });
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t("error"), t("rx_error_photo"));
    }
  };

  if (view === "create") {
    const selectedPatient = patients.find((p) => p.id === selectedPatientId);
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant bg-surface">
          <TouchableOpacity
            onPress={() => setView("list")}
            className="flex-row items-center gap-2"
          >
            <IconSymbol name="chevron.left" size={24} color="#00488d" />
            <Text className="font-display font-bold text-primary text-lg">
              {t("rx_back")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface_container_high items-center justify-center"
            onPress={() => router.push("/about")}
          >
            <IconSymbol name="info.circle.fill" size={20} color="#00488d" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerClassName="p-6 pb-24">
          <Text className="font-display font-bold text-3xl mb-6 text-on_surface text-center">
            {t("rx_new")}
          </Text>

          <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant mb-6 shadow-sm">
            <Text className="text-xs font-bold tracking-wider mb-2 text-on_surface_variant uppercase">
              {t("rx_select_patient")}
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {patients.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPatientId(p.id)}
                  className={`px-4 py-2 rounded-lg border ${selectedPatientId === p.id ? "bg-primary border-primary" : "bg-surface_container_low border-outline_variant"}`}
                >
                  <Text
                    className={
                      selectedPatientId === p.id
                        ? "text-on_primary font-bold"
                        : "text-on_surface"
                    }
                  >
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedPatient && (
              <View className="bg-primary_container/10 p-4 rounded-lg mb-4">
                <Text className="text-primary font-bold">
                  {t("rx_age", { age: calculateAge(selectedPatient.dob) })}
                </Text>
                <Text className="text-primary">
                  {t("rx_phone")} {selectedPatient.phone}
                </Text>
              </View>
            )}

            <View className="mb-4">
              <Text className="text-xs font-bold tracking-wider mb-2 text-on_surface_variant uppercase">
                {t("rx_attending_doctor")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low p-4 rounded-lg text-on_surface font-medium opacity-70"
                value={doctor?.name || ""}
                editable={false}
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold tracking-wider mb-2 text-on_surface_variant uppercase">
                {t("rx_clinical_notes")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low p-4 rounded-lg text-on_surface font-medium"
                multiline
                numberOfLines={3}
                placeholder={t("rx_notes_placeholder")}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          <Text className="font-display font-bold text-xl mb-4 text-on_surface">
            {t("rx_medications")}
          </Text>
          {medications.map((med, index) => (
            <View
              key={index}
              className="bg-surface_container_lowest p-4 rounded-xl border border-outline_variant mb-4 shadow-sm relative"
            >
              <TextInput
                placeholder={t("rx_med_name")}
                className="bg-surface_container_low p-3 rounded-lg mb-2 text-on_surface"
                value={med.name}
                onChangeText={(v) => updateMedication(index, "name", v)}
              />
              <View className="flex-row gap-2 mb-2">
                <TextInput
                  placeholder={t("rx_dosage_placeholder")}
                  className="flex-1 bg-surface_container_low p-3 rounded-lg text-on_surface"
                  value={med.dosage}
                  onChangeText={(v) => updateMedication(index, "dosage", v)}
                />
                <TextInput
                  placeholder={t("rx_freq_placeholder")}
                  className="flex-1 bg-surface_container_low p-3 rounded-lg text-on_surface"
                  value={med.frequency}
                  onChangeText={(v) => updateMedication(index, "frequency", v)}
                />
              </View>
              <TextInput
                placeholder={t("rx_duration_placeholder")}
                className="bg-surface_container_low p-3 rounded-lg text-on_surface mb-2"
                value={med.duration}
                onChangeText={(v) => updateMedication(index, "duration", v)}
              />
              {medications.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeMedicationRow(index)}
                  className="absolute top-4 right-4 bg-error_container p-1 rounded-full"
                >
                  <IconSymbol name="xmark" size={16} color="#ba1a1a" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            onPress={addMedicationRow}
            className="items-center py-4 mb-8"
          >
            <Text className="text-primary font-bold">
              {t("rx_add_medication")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSavePrescription}
            className="bg-primary py-4 rounded-lg items-center shadow-lg"
          >
            <Text className="font-display font-bold text-white">
              {t("rx_create")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (view === "detail" && detailData) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant bg-surface">
          <TouchableOpacity
            onPress={() => setView("list")}
            className="flex-row items-center gap-2"
          >
            <IconSymbol name="chevron.left" size={24} color="#00488d" />
            <Text className="font-display font-bold text-primary text-lg">
              {t("rx_back")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-surface_container_high items-center justify-center"
            onPress={() => router.push("/about")}
          >
            <IconSymbol name="info.circle.fill" size={20} color="#00488d" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerClassName="p-6 pb-24">
          <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
            <View
              className="bg-white p-6 rounded-xl border border-outline_variant shadow-lg"
              style={{ backgroundColor: "white" }}
            >
              <View className="flex-row justify-between border-b-[3px] border-[#00488d] pb-4 mb-6 items-center">
                <Text
                  style={{
                    fontSize: 50,
                    color: "#00488d",
                    fontWeight: "bold",
                    fontFamily: "serif",
                  }}
                >
                  ℞
                </Text>
                <View className="items-end">
                  <Text className="font-bold text-[#00488d] text-base">
                    {doctor?.name || detailData.doctor_name}
                    {doctor?.specialty ? `, ${doctor.specialty}` : ""}
                  </Text>
                  {doctor?.phone ? (
                    <Text className="text-on_surface_variant text-xs mt-1">
                      {doctor.phone}
                    </Text>
                  ) : null}
                </View>
              </View>

              <Text className="font-display font-bold text-on_surface text-xl mb-6">
                {t("rx_title")}
              </Text>

              <View className="mb-8">
                {detailData.medications.map((m: any, idx: number) => (
                  <View
                    key={idx}
                    className="mb-5 pl-4 py-1 border-l-4 border-[#6099f0]"
                  >
                    <Text className="font-bold text-[#00488d] text-lg mb-1">
                      <Text className="italic pr-1 text-[#00488d] font-serif font-bold">
                        R/{" "}
                      </Text>
                      {m.name}
                    </Text>
                    {m.dosage ? (
                      <Text className="text-on_surface_variant text-sm pl-6 mb-1">
                        {t("rx_qty")} {m.dosage}
                      </Text>
                    ) : null}
                    {m.frequency || m.duration ? (
                      <Text className="text-on_surface_variant text-sm pl-6">
                        {t("rx_sig")} {m.frequency}
                        {m.duration ? `, ${m.duration}` : ""}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>

              <View className="bg-[#eef5fe] p-5 rounded-lg mb-8 border border-[#d6e5fa]">
                <Text className="font-bold text-[#00488d] mb-3 text-base">
                  {t("rx_patient_details")}
                </Text>
                <View className="flex-row items-center mb-1">
                  <Text className="font-bold text-on_surface text-sm w-24">
                    {t("rx_name_label")}
                  </Text>
                  <Text className="text-on_surface text-sm flex-1">
                    {detailData.patient_name},{" "}
                    {calculateAge(detailData.patient_dob)} {t("rx_years_old")}
                  </Text>
                </View>
                {detailData.patient_phone ? (
                  <View className="flex-row items-center mb-1">
                    <Text className="font-bold text-on_surface text-sm w-24">
                      {t("rx_phone_label")}
                    </Text>
                    <Text className="text-on_surface text-sm flex-1">
                      {detailData.patient_phone}
                    </Text>
                  </View>
                ) : null}
                <View className="flex-row items-center mt-1">
                  <Text className="font-bold text-on_surface text-sm w-24">
                    {t("rx_date_label")}
                  </Text>
                  <Text className="text-on_surface text-sm flex-1">
                    {detailData.date}
                  </Text>
                </View>
              </View>

              <View className="items-end mt-4">
                {doctor?.signature ? (
                  <Image
                    source={{ uri: doctor.signature }}
                    style={{ width: 140, height: 70 }}
                    resizeMode="contain"
                    className="mb-2"
                  />
                ) : (
                  <View style={{ height: 70 }} className="mb-2" />
                )}
                <View className="w-48 border-b border-outline mb-2" />
                <Text className="font-bold text-on_surface text-sm">
                  {doctor?.name || detailData.doctor_name}
                  {doctor?.specialty ? `, ${doctor.specialty}` : ""}
                </Text>
                {doctor?.license_number ? (
                  <Text className="text-xs text-on_surface_variant mt-1">
                    CP N° : {doctor.license_number}
                  </Text>
                ) : null}
              </View>
            </View>
          </ViewShot>

          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity
              onPress={exportPDF}
              className="flex-1 bg-surface_container_highest py-4 rounded-lg items-center flex-row justify-center gap-2 shadow-sm border border-outline_variant"
            >
              <IconSymbol name="doc.plaintext.fill" size={20} color="#181c1f" />
              <Text className="text-on_surface font-bold text-sm">
                {t("rx_save_pdf")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={saveToGallery}
              className="flex-1 bg-primary py-4 rounded-lg items-center flex-row justify-center gap-2 shadow-sm"
            >
              <IconSymbol
                name="square.and.arrow.down.fill"
                size={20}
                color="white"
              />
              <Text className="text-white font-bold text-sm">
                {t("rx_save_image")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // DEFAULT VIEW = LIST
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
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
            className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-lg hover:scale-105"
            onPress={() => setView("create")}
          >
            <IconSymbol name="plus" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 py-8 pb-24">
        <View className="mb-8 items-center">
          <Text className="text-primary font-bold tracking-wider text-xs uppercase mb-1 text-center">
            {t("rx_clinical_overview")}
          </Text>
          <Text className="font-display text-4xl font-extrabold text-on_surface leading-tight mb-2 text-center">
            {t("rx_recent")}
          </Text>
          <Text className="text-on_surface_variant max-w-sm mt-2 text-center">
            {t("rx_overview_desc")}
          </Text>
        </View>

        {prescriptions.map((rx) => (
          <TouchableOpacity
            key={rx.id}
            className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant border-l-4 border-l-primary mb-4 shadow-sm"
            onPress={() => openDetail(rx)}
          >
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="font-display text-lg font-bold text-on_surface">
                  {rx.patient_name}
                </Text>
                <Text className="text-xs text-on_surface_variant">
                  ID: #MS-{8800 + rx.patient_id}
                </Text>
              </View>
              <View className="bg-primary_fixed px-3 py-1 rounded-full items-center justify-center">
                <Text className="text-on_primary_fixed font-bold text-xs uppercase">
                  {t("rx_date")}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between border-t border-outline_variant pt-4">
              <View>
                <Text className="text-[10px] text-outline uppercase font-bold tracking-widest mb-1">
                  {t("rx_practitioner")}
                </Text>
                <Text className="font-semibold text-on_surface text-sm">
                  {rx.doctor_name}
                </Text>
              </View>
              <View>
                <Text className="text-[10px] text-outline uppercase font-bold tracking-widest mb-1">
                  {t("rx_date")}
                </Text>
                <Text className="font-semibold text-on_surface text-sm">
                  {rx.date}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {prescriptions.length === 0 && (
          <View className="p-10 items-center justify-center bg-surface_container_low rounded-xl">
            <Text className="text-on_surface_variant text-center">
              {t("rx_empty")}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
