import type { Doctor, Patient } from "../types/schema";

const STORAGE_KEY = "doctorscript-web-db-v1";

type StoredPrescription = {
  id: number;
  date: string;
  notes: string | null;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
};

type WebStorageState = {
  counters: {
    doctors: number;
    patients: number;
    prescriptions: number;
  };
  doctors: Doctor[];
  patients: Patient[];
  prescriptions: StoredPrescription[];
};

const defaultState: WebStorageState = {
  counters: {
    doctors: 1,
    patients: 1,
    prescriptions: 1,
  },
  doctors: [],
  patients: [],
  prescriptions: [],
};

const readState = (): WebStorageState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }
    const parsed = JSON.parse(raw) as WebStorageState;
    return {
      counters: parsed.counters ?? defaultState.counters,
      doctors: parsed.doctors ?? [],
      patients: parsed.patients ?? [],
      prescriptions: parsed.prescriptions ?? [],
    };
  } catch {
    return defaultState;
  }
};

const writeState = (state: WebStorageState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const webStorage = {
  getDoctors: (): Doctor[] => {
    const state = readState();
    return [...state.doctors].sort((a, b) => b.id - a.id);
  },
  addDoctor: (payload: {
    name: string;
    license_number: string;
    specialty: string;
    phone: string;
  }): Doctor => {
    const state = readState();
    const doctor: Doctor = {
      id: state.counters.doctors,
      name: payload.name,
      license_number: payload.license_number,
      specialty: payload.specialty,
      phone: payload.phone,
      signature: "",
    };
    state.counters.doctors += 1;
    state.doctors.unshift(doctor);
    writeState(state);
    return doctor;
  },
  getPatients: (): Patient[] => {
    const state = readState();
    return [...state.patients].sort((a, b) => b.id - a.id);
  },
  addPatient: (payload: {
    name: string;
    dob: string;
    phone: string;
  }): Patient => {
    const state = readState();
    const patient: Patient = {
      id: state.counters.patients,
      name: payload.name,
      dob: payload.dob,
      phone: payload.phone,
    };
    state.counters.patients += 1;
    state.patients.unshift(patient);
    writeState(state);
    return patient;
  },
  addPrescription: (payload: {
    patient_id: number;
    doctor_id: number;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes: string;
  }) => {
    const state = readState();
    const patient = state.patients.find((p) => p.id === payload.patient_id);
    const doctor = state.doctors.find((d) => d.id === payload.doctor_id);

    if (!patient || !doctor) {
      throw new Error("Patient or doctor not found");
    }

    const prescription: StoredPrescription = {
      id: state.counters.prescriptions,
      date: new Date().toISOString(),
      notes: payload.notes || null,
      patient_id: patient.id,
      patient_name: patient.name,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      medication_name: payload.medication_name,
      dosage: payload.dosage,
      frequency: payload.frequency,
      duration: payload.duration,
    };

    state.counters.prescriptions += 1;
    state.prescriptions.unshift(prescription);
    writeState(state);
    return prescription;
  },
  getPrescriptions: (): StoredPrescription[] => {
    const state = readState();
    return [...state.prescriptions].sort((a, b) => b.id - a.id);
  },
  getStats: () => {
    const state = readState();
    return {
      doctors: state.doctors.length,
      patients: state.patients.length,
      prescriptions: state.prescriptions.length,
    };
  },
};

export type { StoredPrescription };
