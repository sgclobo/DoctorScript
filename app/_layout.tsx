import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/i18n";
import i18n from "@/i18n";
import { initDB } from "@/services/database";
import { getStoredLanguage } from "@/services/language";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

const APP_VERSION = "1.0.0";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbInitiated, setDbInitiated] = useState(false);

  useEffect(() => {
    initDB()
      .then(async () => {
        const savedLang = await getStoredLanguage();
        if (savedLang) {
          i18n.changeLanguage(savedLang);
        }
        setDbInitiated(true);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof window === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let hasRefreshed = false;

    const promptServiceWorkerActivation = (
      registration: ServiceWorkerRegistration,
    ) => {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    };

    const attachUpdateHandlers = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        promptServiceWorkerActivation(registration);
      }

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;

        if (!installingWorker) {
          return;
        }

        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            promptServiceWorkerActivation(registration);
          }
        });
      });
    };

    const handleControllerChange = () => {
      if (hasRefreshed) {
        return;
      }

      hasRefreshed = true;
      window.location.reload();
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          `/sw.js?v=${APP_VERSION}`,
        );
        attachUpdateHandlers(registration);
        registration.update().catch(console.error);
      } catch (error) {
        console.error(error);
      }
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );
    window.addEventListener("load", registerServiceWorker);

    return () => {
      window.removeEventListener("load", registerServiceWorker);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
    };
  }, []);

  if (!dbInitiated) {
    return null; // Or a splash screen
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
