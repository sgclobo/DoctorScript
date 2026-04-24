import { Linking } from "react-native";
import { getDB } from "./database";

const KEY_APP_LOCKED = "app_locked";
const KEY_LAST_BACKGROUND_AT = "last_background_at";

const setSetting = async (key: string, value: string) => {
  const db = await getDB();
  await db.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
    key,
    value,
  );
};

const getSetting = async (key: string): Promise<string | null> => {
  const db = await getDB();
  const result = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = ?",
    key,
  );
  return result?.value ?? null;
};

export const getDoctorPassword = async (): Promise<string | null> => {
  const db = await getDB();
  const doctor = await db.getFirstAsync<{ password: string | null }>(
    "SELECT password FROM doctors LIMIT 1",
  );
  return doctor?.password ?? null;
};

export const hasDoctorPassword = async (): Promise<boolean> => {
  const password = await getDoctorPassword();
  return Boolean(password && password.trim());
};

type RecoveryResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "missing-doctor-email"
        | "email-mismatch"
        | "missing-password"
        | "unsupported";
    };

export const sendPasswordRecoveryEmail = async (
  recoveryEmail: string,
): Promise<RecoveryResult> => {
  const db = await getDB();
  const doctor = await db.getFirstAsync<{
    name: string;
    email: string | null;
    password: string | null;
  }>("SELECT name, email, password FROM doctors ORDER BY id ASC LIMIT 1");

  const registeredEmail = doctor?.email?.trim();
  if (!registeredEmail) {
    return { ok: false, reason: "missing-doctor-email" };
  }

  if (registeredEmail.toLowerCase() !== recoveryEmail.trim().toLowerCase()) {
    return { ok: false, reason: "email-mismatch" };
  }

  if (!doctor?.password) {
    return { ok: false, reason: "missing-password" };
  }

  const subject = encodeURIComponent("DoctorScript Password Recovery");
  const body = encodeURIComponent(
    `Hello ${doctor.name},\n\n` +
      `This is your DoctorScript password recovery email.\n\n` +
      `Current password: ${doctor.password}\n\n` +
      `If you did not request this, change your password in the app immediately.`,
  );

  const mailUrl = `mailto:${registeredEmail}?subject=${subject}&body=${body}`;
  const canOpen = await Linking.canOpenURL(mailUrl);
  if (!canOpen) {
    return { ok: false, reason: "unsupported" };
  }

  await Linking.openURL(mailUrl);
  return { ok: true };
};

export const hasRegisteredDoctor = async (): Promise<boolean> => {
  const db = await getDB();
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM doctors",
  );
  return (result?.count ?? 0) > 0;
};

export const setAppLocked = async (locked: boolean) => {
  await setSetting(KEY_APP_LOCKED, locked ? "1" : "0");
};

export const isAppLocked = async (): Promise<boolean> => {
  const value = await getSetting(KEY_APP_LOCKED);
  return value === "1";
};

export const markAppBackgroundedNow = async () => {
  await setSetting(KEY_LAST_BACKGROUND_AT, String(Date.now()));
};

export const shouldLockForIdle = async (
  maxIdleMs: number,
): Promise<boolean> => {
  const last = await getSetting(KEY_LAST_BACKGROUND_AT);
  if (!last) {
    return false;
  }

  const lastTs = Number(last);
  if (!Number.isFinite(lastTs)) {
    return false;
  }

  return Date.now() - lastTs > maxIdleMs;
};
