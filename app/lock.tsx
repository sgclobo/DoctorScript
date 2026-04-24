import { IconSymbol } from "@/components/ui/icon-symbol";
import {
    getDoctorPassword,
    sendPasswordRecoveryEmail,
    setAppLocked,
} from "@/services/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LockScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  useEffect(() => {
    const loadPassword = async () => {
      const doctorPassword = await getDoctorPassword();
      setStoredPassword(doctorPassword);

      // Keep user on this screen when password exists; fallback button is shown when missing.
    };

    loadPassword().catch(console.error);
  }, [router]);

  const handleUnlock = async () => {
    if (!storedPassword) {
      Alert.alert(t("error"), t("auth_password_required"));
      return;
    }

    if (!password) {
      Alert.alert(t("error"), t("auth_enter_password"));
      return;
    }

    if (password !== storedPassword) {
      Alert.alert(t("error"), t("auth_invalid_password"));
      return;
    }

    await setAppLocked(false);
    router.replace("/(tabs)");
  };

  const handleReturn = async () => {
    await setAppLocked(false);
    router.replace("/(tabs)");
  };

  const handleRecoverPassword = async () => {
    const email = recoveryEmail.trim();
    if (!email) {
      Alert.alert(t("error"), t("auth_email_required"));
      return;
    }

    const result = await sendPasswordRecoveryEmail(email);
    if (result.ok) {
      Alert.alert(t("success"), t("auth_recovery_sent"));
      return;
    }

    if (result.reason === "missing-doctor-email") {
      Alert.alert(t("error"), t("auth_recovery_missing_email"));
      return;
    }

    if (result.reason === "email-mismatch") {
      Alert.alert(t("error"), t("auth_recovery_email_mismatch"));
      return;
    }

    if (result.reason === "missing-password") {
      Alert.alert(t("error"), t("auth_recovery_missing_password"));
      return;
    }

    Alert.alert(t("error"), t("auth_recovery_open_failed"));
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <View className="flex-1 px-6 py-8 justify-center">
        <View className="items-center mb-8">
          <View className="w-14 h-14 rounded-full bg-primary_container items-center justify-center mb-4">
            <IconSymbol
              name="person.crop.circle.fill"
              size={28}
              color="#00488d"
            />
          </View>
          <Text className="text-3xl font-display font-extrabold text-on_surface text-center mb-2">
            {t("auth_unlock_title")}
          </Text>
          <Text className="text-on_surface_variant text-center">
            {t("auth_unlock_subtitle")}
          </Text>
        </View>

        <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant">
          {storedPassword ? (
            <>
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

              <TouchableOpacity
                className="bg-primary py-4 rounded-lg items-center mt-5"
                onPress={handleUnlock}
              >
                <Text className="font-display font-bold text-white">
                  {t("auth_unlock")}
                </Text>
              </TouchableOpacity>

              <Text className="text-on_surface_variant text-center mt-6 mb-2">
                {t("auth_forgot_password")}
              </Text>
              <TextInput
                className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
                placeholder={t("auth_recovery_email_placeholder")}
                placeholderTextColor="#727783"
                value={recoveryEmail}
                onChangeText={setRecoveryEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                className="bg-surface_container_highest py-4 rounded-lg items-center mt-3"
                onPress={handleRecoverPassword}
              >
                <Text className="font-display font-bold text-on_surface">
                  {t("auth_recover_via_email")}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="text-on_surface_variant text-center">
                {t("auth_password_missing")}
              </Text>
              <TouchableOpacity
                className="bg-primary py-4 rounded-lg items-center mt-5"
                onPress={handleReturn}
              >
                <Text className="font-display font-bold text-white">
                  {t("auth_back_home")}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
