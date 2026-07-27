import { Stack } from "expo-router";
import { useEffect } from "react";

import { initDB } from "../services/database";

export default function RootLayout() {
  useEffect(() => {
    void initDB().catch((error) => {
      console.error("Database initialization failed", error);
    });
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
