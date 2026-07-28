import * as SQLite from "expo-sqlite";

import {
    getSharedDb,
    getSharedDbPromise,
    getSharedInitPromise,
    setSharedDb,
    setSharedDbPromise,
    setSharedInitPromise,
} from "./db-instance";

export const getDB = async () => {
  const existing = getSharedDb();
  if (existing) {
    return existing;
  }

  let dbPromise = getSharedDbPromise();
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("doctorscript2.db").then((db) => {
      setSharedDb(db);
      return db;
    });
    setSharedDbPromise(dbPromise);
  }

  return await dbPromise;
};

export const initDB = async () => {
  let initPromise = getSharedInitPromise();
  if (initPromise) {
    return await initPromise;
  }

  initPromise = (async () => {
    const db = await getDB();

    // WAL mode is not always available on all SQLite backends (notably some web runtimes).
    try {
      await db.execAsync("PRAGMA journal_mode = WAL;");
    } catch {
      // Non-fatal: default mode is acceptable for this app.
    }

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        license_number TEXT,
        specialty TEXT,
        phone TEXT,
        signature TEXT
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        dob TEXT NOT NULL,
        phone TEXT
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY NOT NULL,
        patient_id INTEGER NOT NULL,
        doctor_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (id)
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY NOT NULL,
        prescription_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        duration TEXT NOT NULL,
        FOREIGN KEY (prescription_id) REFERENCES prescriptions (id)
      );
    `);

    const doctorColumns = await db.getAllAsync<{ name: string }>(
      "PRAGMA table_info(doctors);",
    );
    const hasSignatureColumn = doctorColumns.some(
      (column) => column.name === "signature",
    );
    if (!hasSignatureColumn) {
      await db.execAsync("ALTER TABLE doctors ADD COLUMN signature TEXT;");
    }
  })();
  setSharedInitPromise(initPromise);

  try {
    await initPromise;
  } catch (error) {
    setSharedInitPromise(null);
    throw error;
  }
};
