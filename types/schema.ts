export interface Doctor {
  id: number;
  name: string;
  license_number: string;
  specialty: string;
  phone: string;
  signature?: string;
}

export interface Patient {
  id: number;
  name: string;
  dob: string;
  phone: string;
}

export interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  notes: string;
}

export interface Medication {
  id: number;
  prescription_id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}
