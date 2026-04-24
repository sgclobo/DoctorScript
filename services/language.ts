import { getDB } from "./database";

const LANGUAGE_KEY = "app_language";

export const getStoredLanguage = async (): Promise<string | null> => {
  try {
    const db = await getDB();
    const result = await db.getFirstAsync<{ value: string }>(
      "SELECT value FROM settings WHERE key = ?",
      LANGUAGE_KEY,
    );
    return result?.value ?? null;
  } catch {
    return null;
  }
};

export const setStoredLanguage = async (lang: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.runAsync(
      "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
      LANGUAGE_KEY,
      lang,
    );
  } catch (e) {
    console.error("Failed to save language preference", e);
  }
};
