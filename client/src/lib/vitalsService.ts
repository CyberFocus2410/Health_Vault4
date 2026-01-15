import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Type for vitals (helps consistency)
export interface VitalRecord {
  patientId: string;
  spo2: number;
  pulse: number;
  bpSys: number;
  bpDia: number;
  sugar: number;
  temperature: number;
  weight?: number;
  createdAt: Date;
}

// Save vitals to Firestore
export const saveVitals = async (vitals: VitalRecord) => {
  await addDoc(collection(db, "vitals"), {
    ...vitals,
    createdAt: Timestamp.fromDate(vitals.createdAt),
  });
};

// Fetch vitals history for a patient
export const getVitalsByPatient = async (patientId: string) => {
  const q = query(
    collection(db, "vitals"),
    where("patientId", "==", patientId),
    orderBy("createdAt", "asc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
  }));
};
