import * as SQLite from 'expo-sqlite';

export const getDB = async () => {
  return await SQLite.openDatabaseAsync('doctorscript2.db');
};

export const initDB = async () => {
  const db = await getDB();
  
  await db.execAsync('PRAGMA journal_mode = WAL;');
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

  try {
    await db.execAsync("ALTER TABLE doctors ADD COLUMN signature TEXT;");
  } catch (e) {
    // Column might already exist
  }
};
