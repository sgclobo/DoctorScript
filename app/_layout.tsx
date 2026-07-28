import { Stack } from "expo-router";
import { useEffect } from "react";

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
