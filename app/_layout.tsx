import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { getDB, initDB } from "../services/database";
import { setSharedDb } from "../services/db-instance";

export default function RootLayout() {
  useEffect(() => {
    void (async () => {
      try {
        const db = await getDB();
        setSharedDb(db);
        await initDB();
      } catch (error) {
        console.error("Database initialization failed", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed", error);
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
