import { Tabs, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    hasDoctorPassword,
    hasRegisteredDoctor,
    isAppLocked,
    markAppBackgroundedNow,
    setAppLocked,
    shouldLockForIdle,
} from "@/services/auth";
import { AppState } from "react-native";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    console.info(`[TabDiagnostics] active route: ${pathname}`);
  }, [pathname]);

  useEffect(() => {
    const checkLockState = async () => {
      const hasDoctor = await hasRegisteredDoctor();
      if (!hasDoctor) {
        return;
      }

      const canLock = await hasDoctorPassword();
      if (!canLock) {
        await setAppLocked(false);
        return;
      }

      const locked = await isAppLocked();
      if (locked) {
        router.replace("/lock");
      }
    };

    checkLockState().catch(console.error);
  }, [router]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "background" || state === "inactive") {
        await markAppBackgroundedNow();
        return;
      }

      if (state !== "active") {
        return;
      }

      const hasDoctor = await hasRegisteredDoctor();
      if (!hasDoctor) {
        return;
      }

      const canLock = await hasDoctorPassword();
      if (!canLock) {
        await setAppLocked(false);
        return;
      }

      const needsIdleLock = await shouldLockForIdle(IDLE_TIMEOUT_MS);
      if (!needsIdleLock) {
        return;
      }

      await setAppLocked(true);
      router.replace("/lock");
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderTopWidth: 1,
          borderTopColor: "rgba(194, 198, 212, 0.2)",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab_home"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: t("tab_patients"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prescriptions"
        options={{
          title: t("tab_prescriptions"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.plaintext.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: t("tab_help"),
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="questionmark.circle.fill"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
