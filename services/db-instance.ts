import type { SQLiteDatabase } from "expo-sqlite";

type DbGlobalState = {
  __doctorScriptDb?: SQLiteDatabase;
  __doctorScriptDbPromise?: Promise<SQLiteDatabase>;
  __doctorScriptInitPromise?: Promise<void>;
};

const state = globalThis as typeof globalThis & DbGlobalState;

export const setSharedDb = (db: SQLiteDatabase) => {
  state.__doctorScriptDb = db;
};

export const getSharedDb = () => state.__doctorScriptDb ?? null;

export const getSharedDbPromise = () => state.__doctorScriptDbPromise ?? null;

export const setSharedDbPromise = (dbPromise: Promise<SQLiteDatabase>) => {
  state.__doctorScriptDbPromise = dbPromise;
};

export const getSharedInitPromise = () =>
  state.__doctorScriptInitPromise ?? null;

export const setSharedInitPromise = (initPromise: Promise<void> | null) => {
  if (initPromise) {
    state.__doctorScriptInitPromise = initPromise;
  } else {
    delete state.__doctorScriptInitPromise;
  }
};
