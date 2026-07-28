import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
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
import type { Doctor } from "../types/schema";

export default function DoctorsScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const loadDoctors = async () => {
    await initDB();
    const db = await getDB();
    const rows = await db.getAllAsync<Doctor>(
      "SELECT id, name, license_number, specialty, phone, signature FROM doctors ORDER BY id DESC",
    );
    setDoctors(rows);
  };

  useEffect(() => {
    void loadDoctors().catch((loadError) => {
      setError("Could not load doctors. Please refresh and try again.");
      console.error("Doctors load failed", loadError);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadDoctors().catch((loadError) => {
        setError("Could not load doctors. Please refresh and try again.");
        console.error("Doctors focus refresh failed", loadError);
      });
    }, []),
  );

  const saveDoctor = async () => {
    if (!name.trim()) {
      setError("Doctor name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const db = await getDB();
      await db.runAsync(
        "INSERT INTO doctors (name, license_number, specialty, phone) VALUES (?, ?, ?, ?)",
        name.trim(),
        licenseNumber.trim(),
        specialty.trim(),
        phone.trim(),
      );

      setName("");
      setLicenseNumber("");
      setSpecialty("");
      setPhone("");
      await loadDoctors();
    } catch {
      setError("Could not save doctor. Please try again.");
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

        <Text style={styles.title}>Doctor Profiles</Text>
        <Text style={styles.subtitle}>
          Maintain practitioner details used in prescriptions.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Doctor</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Dr. Maria Lopez"
            style={styles.input}
          />

          <Text style={styles.label}>License Number</Text>
          <TextInput
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="e.g. MED-2026-3321"
            style={styles.input}
          />

          <Text style={styles.label}>Specialty</Text>
          <TextInput
            value={specialty}
            onChangeText={setSpecialty}
            placeholder="e.g. Internal Medicine"
            style={styles.input}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +1 555 111 9999"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={styles.button}
            onPress={saveDoctor}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Saving..." : "Save Doctor"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Stored Doctors ({doctors.length})
          </Text>
          {doctors.length === 0 ? (
            <Text style={styles.emptyText}>No doctors yet. Add one above.</Text>
          ) : (
            doctors.map((doctor) => (
              <View key={doctor.id} style={styles.listItem}>
                <Text style={styles.listName}>{doctor.name}</Text>
                <Text style={styles.listMeta}>
                  License: {doctor.license_number || "-"}
                </Text>
                <Text style={styles.listMeta}>
                  Specialty: {doctor.specialty || "-"}
                </Text>
                <Text style={styles.listMeta}>
                  Phone: {doctor.phone || "-"}
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
