export const PATIENT_LIMIT_ENABLED = false;
export const MAX_FREE_PATIENTS: number | null = null;

export const canRegisterPatient = (currentPatientCount: number): boolean => {
  if (!PATIENT_LIMIT_ENABLED || MAX_FREE_PATIENTS === null) {
    return true;
  }

  return currentPatientCount < MAX_FREE_PATIENTS;
};
