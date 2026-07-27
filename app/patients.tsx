import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { getDB, initDB } from "../services/database";
import type { Patient } from "../types/schema";

export default function PatientsScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const loadPatients = async () => {
    await initDB();
    const db = await getDB();
    const rows = await db.getAllAsync<Patient>(
      "SELECT id, name, dob, phone FROM patients ORDER BY id DESC",
    );
    setPatients(rows);
  };

  useEffect(() => {
    void loadPatients().catch((loadError) => {
      setError("Could not load patients. Please refresh and try again.");
      console.error("Patients load failed", loadError);
    });
  }, []);

  const savePatient = async () => {
    if (!name.trim() || !dob.trim()) {
      setError("Name and Date of Birth are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const db = await getDB();
      await db.runAsync(
        "INSERT INTO patients (name, dob, phone) VALUES (?, ?, ?)",
        name.trim(),
        dob.trim(),
        phone.trim(),
      );

      setName("");
      setDob("");
      setPhone("");
      await loadPatients();
    } catch {
      setError("Could not save patient. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.backLink}>Back to Home</Text>
        </Pressable>

        <Text style={styles.title}>Patient Registry</Text>
        <Text style={styles.subtitle}>
          Add and review patient profiles stored on-device.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Patient</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. John Doe"
            style={styles.input}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +1 555 123 4567"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={styles.button}
            onPress={savePatient}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Save Patient"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Stored Patients ({patients.length})
          </Text>
          {patients.length === 0 ? (
            <Text style={styles.emptyText}>
              No patients yet. Add one above.
            </Text>
          ) : (
            patients.map((patient) => (
              <View key={patient.id} style={styles.listItem}>
                <Text style={styles.listName}>{patient.name}</Text>
                <Text style={styles.listMeta}>DOB: {patient.dob}</Text>
                <Text style={styles.listMeta}>
                  Phone: {patient.phone || "-"}
                </Text>
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
    maxWidth: 900,
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
    marginBottom: 6,
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
  emptyText: {
    color: "#64748b",
  },
  listItem: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    gap: 2,
  },
  listName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  listMeta: {
    fontSize: 13,
    color: "#475569",
  },
});
