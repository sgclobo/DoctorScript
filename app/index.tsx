import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getDB, initDB } from "../services/database";
import "../services/db-instance";

type Stats = {
  patients: number;
  doctors: number;
  prescriptions: number;
};

export default function Index() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    patients: 0,
    doctors: 0,
    prescriptions: 0,
  });

  const loadStats = useCallback(async () => {
    await initDB();
    const db = await getDB();
    const patientCount = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM patients",
    );
    const doctorCount = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM doctors",
    );
    const prescriptionCount = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM prescriptions",
    );

    setStats({
      patients: patientCount?.count ?? 0,
      doctors: doctorCount?.count ?? 0,
      prescriptions: prescriptionCount?.count ?? 0,
    });
  }, []);

  useEffect(() => {
    void loadStats().catch((error) => {
      console.error("Failed to load dashboard stats", error);
    });
  }, [loadStats]);

  useFocusEffect(
    useCallback(() => {
      void loadStats().catch((error) => {
        console.error("Failed to refresh dashboard stats", error);
      });
    }, [loadStats]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.backgroundOrbTop} />
      <View style={styles.backgroundOrbBottom} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>Doctor Workspace</Text>
        <Text style={styles.title}>DoctorScript</Text>
        <Text style={styles.subtitle}>
          Offline-first patient and prescription management
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Everything in one clinic dashboard
          </Text>
          <Text style={styles.body}>
            Register patients, manage your practitioner profile, and generate
            clean digital prescriptions without relying on internet access.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{stats.patients}</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{stats.doctors}</Text>
              <Text style={styles.statLabel}>Doctors</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{stats.prescriptions}</Text>
              <Text style={styles.statLabel}>Scripts</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <Pressable
            style={styles.featureCard}
            onPress={() => router.push("/patients")}
          >
            <Text style={styles.featureTitle}>Patients</Text>
            <Text style={styles.featureBody}>
              Securely store demographic details and visit history.
            </Text>
            <Text style={styles.featureLink}>Open Patient Registry</Text>
          </Pressable>

          <Pressable
            style={styles.featureCard}
            onPress={() => router.push("/prescriptions")}
          >
            <Text style={styles.featureTitle}>Prescriptions</Text>
            <Text style={styles.featureBody}>
              Build professional scripts with dosage and timing clarity.
            </Text>
            <Text style={styles.featureLink}>Create Prescription</Text>
          </Pressable>

          <Pressable
            style={styles.featureCard}
            onPress={() => router.push("/doctors")}
          >
            <Text style={styles.featureTitle}>Doctors</Text>
            <Text style={styles.featureBody}>
              Maintain practitioner profile and licensing details.
            </Text>
            <Text style={styles.featureLink}>Manage Doctors</Text>
          </Pressable>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Privacy</Text>
            <Text style={styles.featureBody}>
              Data stays local on device with SQLite-backed storage.
            </Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Functional routes are now wired. Use the cards above to add doctors,
          register patients, and create prescriptions.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fbff",
  },
  backgroundOrbTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#dbeafe",
  },
  backgroundOrbBottom: {
    position: "absolute",
    bottom: -140,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#e0f2fe",
  },
  scrollContent: {
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 12,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#334155",
    marginTop: 4,
    marginBottom: 6,
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: "#475569",
  },
  statsRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  statPill: {
    minWidth: 92,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    borderColor: "#dbeafe",
    borderWidth: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  statLabel: {
    fontSize: 12,
    color: "#334155",
    marginTop: 1,
  },
  grid: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    flexGrow: 1,
    flexBasis: 220,
    minHeight: 118,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dbe4f0",
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1d4ed8",
    marginBottom: 6,
  },
  featureBody: {
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },
  featureLink: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#1d4ed8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  footerNote: {
    marginTop: 8,
    fontSize: 13,
    color: "#64748b",
  },
});
