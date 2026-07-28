import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { getDB, initDB } from "../services/database";
import type { Doctor, Patient } from "../types/schema";

type PrescriptionRow = {
  id: number;
  date: string;
  notes: string | null;
  patient_name: string;
  doctor_name: string;
  medication_name: string | null;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
};

export default function PrescriptionsScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [rows, setRows] = useState<PrescriptionRow[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    await initDB();
    const db = await getDB();

    const patientRows = await db.getAllAsync<Patient>(
      "SELECT id, name, dob, phone FROM patients ORDER BY id DESC",
    );
    const doctorRows = await db.getAllAsync<Doctor>(
      "SELECT id, name, license_number, specialty, phone, signature FROM doctors ORDER BY id DESC",
    );

    setPatients(patientRows);
    setDoctors(doctorRows);

    try {
      const prescriptionRows = await db.getAllAsync<PrescriptionRow>(`
        SELECT
          p.id,
          p.date,
          p.notes,
          pa.name as patient_name,
          d.name as doctor_name,
          m.name as medication_name,
          m.dosage,
          m.frequency,
          m.duration
        FROM prescriptions p
        INNER JOIN patients pa ON pa.id = p.patient_id
        INNER JOIN doctors d ON d.id = p.doctor_id
        LEFT JOIN medications m ON m.prescription_id = p.id
        ORDER BY p.id DESC
      `);
      setRows(prescriptionRows);
    } catch (queryError) {
      setRows([]);
      setError(
        "Could not load prescription history. You can still create a new prescription.",
      );
      console.error("Prescriptions history query failed", queryError);
    }

    if (patientRows.length > 0 && selectedPatientId === null) {
      setSelectedPatientId(patientRows[0].id);
    }
    if (doctorRows.length > 0 && selectedDoctorId === null) {
      setSelectedDoctorId(doctorRows[0].id);
    }
  }, [selectedDoctorId, selectedPatientId]);

  useEffect(() => {
    void loadData().catch((loadError) => {
      setError(
        "Could not load prescription data. Please refresh and try again.",
      );
      console.error("Prescriptions load failed", loadError);
    });
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      void loadData().catch((loadError) => {
        setError(
          "Could not refresh prescription data. Please refresh and try again.",
        );
        console.error("Prescriptions focus refresh failed", loadError);
      });
    }, [loadData]),
  );

  const savePrescription = async () => {
    if (!selectedPatientId || !selectedDoctorId) {
      setError("Create at least one patient and one doctor first.");
      return;
    }
    if (
      !medicationName.trim() ||
      !dosage.trim() ||
      !frequency.trim() ||
      !duration.trim()
    ) {
      setError("Medication, dosage, frequency, and duration are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const db = await getDB();
      const result = await db.runAsync(
        "INSERT INTO prescriptions (patient_id, doctor_id, date, notes) VALUES (?, ?, ?, ?)",
        selectedPatientId,
        selectedDoctorId,
        new Date().toISOString(),
        notes.trim(),
      );

      const prescriptionId = Number(result.lastInsertRowId);
      await db.runAsync(
        "INSERT INTO medications (prescription_id, name, dosage, frequency, duration) VALUES (?, ?, ?, ?, ?)",
        prescriptionId,
        medicationName.trim(),
        dosage.trim(),
        frequency.trim(),
        duration.trim(),
      );

      setMedicationName("");
      setDosage("");
      setFrequency("");
      setDuration("");
      setNotes("");

      await loadData();
    } catch {
      setError("Could not save prescription. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Link href="../index.html" asChild>
          <Pressable>
            <Text style={styles.backLink}>Back to Home</Text>
          </Pressable>
        </Link>

        <Text style={styles.title}>Prescription Engine</Text>
        <Text style={styles.subtitle}>
          Create scripts using existing patient and doctor records.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Patient</Text>
          <View style={styles.chipsWrap}>
            {patients.map((patient) => {
              const active = selectedPatientId === patient.id;
              return (
                <Pressable
                  key={patient.id}
                  style={[styles.chip, active ? styles.chipActive : undefined]}
                  onPress={() => setSelectedPatientId(patient.id)}
                >
                  <Text
                    style={active ? styles.chipTextActive : styles.chipText}
                  >
                    {patient.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {patients.length === 0 ? (
            <Text style={styles.hint}>No patients available yet.</Text>
          ) : null}

          <Text style={[styles.cardTitle, styles.sectionTitle]}>
            Select Doctor
          </Text>
          <View style={styles.chipsWrap}>
            {doctors.map((doctor) => {
              const active = selectedDoctorId === doctor.id;
              return (
                <Pressable
                  key={doctor.id}
                  style={[styles.chip, active ? styles.chipActive : undefined]}
                  onPress={() => setSelectedDoctorId(doctor.id)}
                >
                  <Text
                    style={active ? styles.chipTextActive : styles.chipText}
                  >
                    {doctor.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {doctors.length === 0 ? (
            <Text style={styles.hint}>No doctors available yet.</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medication Details</Text>

          <Text style={styles.label}>Medication</Text>
          <TextInput
            value={medicationName}
            onChangeText={setMedicationName}
            placeholder="e.g. Amoxicillin"
            style={styles.input}
          />

          <Text style={styles.label}>Dosage</Text>
          <TextInput
            value={dosage}
            onChangeText={setDosage}
            placeholder="e.g. 500mg"
            style={styles.input}
          />

          <Text style={styles.label}>Frequency</Text>
          <TextInput
            value={frequency}
            onChangeText={setFrequency}
            placeholder="e.g. TID"
            style={styles.input}
          />

          <Text style={styles.label}>Duration</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g. 7 days"
            style={styles.input}
          />

          <Text style={styles.label}>Clinical Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes"
            style={[styles.input, styles.notesInput]}
            multiline
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={styles.button}
            onPress={savePrescription}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Save Prescription"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Recent Prescriptions ({rows.length})
          </Text>
          {rows.length === 0 ? (
            <Text style={styles.hint}>No prescriptions recorded yet.</Text>
          ) : (
            rows.map((row) => (
              <View key={row.id} style={styles.listItem}>
                <Text style={styles.listTitle}>
                  #{row.id} {row.patient_name}
                </Text>
                <Text style={styles.listMeta}>Doctor: {row.doctor_name}</Text>
                <Text style={styles.listMeta}>
                  Medication: {row.medication_name || "-"} {row.dosage || ""}{" "}
                  {row.frequency || ""} {row.duration || ""}
                </Text>
                <Text style={styles.listMeta}>
                  Date: {new Date(row.date).toLocaleString()}
                </Text>
                {row.notes ? (
                  <Text style={styles.listMeta}>Notes: {row.notes}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fbff",
  },
  content: {
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 40,
    gap: 14,
  },
  backLink: {
    color: "#1d4ed8",
    fontWeight: "700",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe4f0",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  sectionTitle: {
    marginTop: 10,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
  },
  chipActive: {
    backgroundColor: "#1d4ed8",
    borderColor: "#1d4ed8",
  },
  chipText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    textTransform: "uppercase",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderColor: "#dbe4f0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: "#1d4ed8",
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  error: {
    color: "#b91c1c",
    fontWeight: "600",
    marginTop: 2,
  },
  hint: {
    color: "#64748b",
    marginTop: 2,
  },
  listItem: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    gap: 2,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  listMeta: {
    fontSize: 13,
    color: "#475569",
  },
});
