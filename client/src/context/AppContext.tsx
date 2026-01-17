import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { format, subMonths } from "date-fns";

// Types
export type UserRole = "patient" | "doctor" | "lab" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  abhaId?: string; // For patients
}

export interface VitalRecord {
  id: string;
  date: string;
  spO2: number;
  bpSystolic: number;
  bpDiastolic: number;
  sugarFasting: number;
  sugarPostMeal: number;
  pulse: number;
  temperature: number;
  weight: number;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  type: "blood" | "radiology" | "prescription" | "other";
  date: string;
  uploadedBy: string; // Lab Name
  summary?: string; // AI Summary
  fileUrl?: string; // Mock URL
}

export interface AccessRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  status: "pending" | "approved" | "denied";
  date: string;
}

// Mock Data
const MOCK_PATIENT: User = {
  id: "p1",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  role: "patient",
  abhaId: "1234-5678-9012"
};

const MOCK_DOCTOR: User = {
  id: "d1",
  name: "Dr. Anjali Gupta",
  email: "anjali@hospital.com",
  role: "doctor"
};

const MOCK_LAB: User = {
  id: "l1",
  name: "City Diagnostic Centre",
  email: "lab@city.com",
  role: "lab"
};

const INITIAL_VITALS: VitalRecord[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `v${i}`,
  date: format(subMonths(new Date(), 5 - i), "yyyy-MM-dd"),
  spO2: 97 + Math.floor(Math.random() * 2),
  bpSystolic: 118 + Math.floor(Math.random() * 10),
  bpDiastolic: 78 + Math.floor(Math.random() * 5),
  sugarFasting: 90 + Math.floor(Math.random() * 10),
  sugarPostMeal: 130 + Math.floor(Math.random() * 15),
  pulse: 70 + Math.floor(Math.random() * 10),
  temperature: 98.4,
  weight: 72 + Math.random()
}));

const INITIAL_REPORTS: MedicalReport[] = [
  {
    id: "r1",
    patientId: "p1",
    title: "Complete Blood Count (CBC)",
    type: "blood",
    date: "2025-10-15",
    uploadedBy: "City Diagnostic Centre",
    summary: "Hemoglobin is slightly low (12.5 g/dL). WBC count is normal. Platelets are stable at 250k."
  },
  {
    id: "r2",
    patientId: "p1",
    title: "Chest X-Ray PA View",
    type: "radiology",
    date: "2025-11-20",
    uploadedBy: "City Diagnostic Centre",
    summary: "Clear lung fields. No sign of consolidation or pleural effusion. Cardiac shadow is normal."
  },
  {
    id: "r3",
    patientId: "p1",
    title: "Lipid Profile",
    type: "blood",
    date: "2026-01-10",
    uploadedBy: "City Diagnostic Centre",
    summary: "Total Cholesterol is borderline high (210 mg/dL). LDL is 130 mg/dL. HDL is 45 mg/dL. Dietary changes recommended."
  }
];

export interface Reminder {
  id: string;
  type: "appointment" | "medicine" | "vitals";
  title: string;
  time: string;
  date?: string;
}

export interface EmergencyProfile {
  bloodGroup: string;
  allergies: string;
  medications: string;
  healthProblems: string;
  emergencyContact: string;
}

export interface SharedRecord {
  id: string;
  patientId: string;
  doctorId: string;
  recordId: string;
  type: "report" | "vitals";
  sharedAt: string;
  doctorComment?: string;
}

// Context Interface
interface AppContextType {
  currentUser: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  vitals: VitalRecord[];
  addVital: (vital: Omit<VitalRecord, "id">) => void;
  reports: MedicalReport[];
  addReport: (report: Omit<MedicalReport, "id" | "summary">) => void;
  accessRequests: AccessRequest[];
  requestAccess: (patientId: string) => void;
  updateAccessStatus: (requestId: string, status: "approved" | "denied") => void;
  generateAISummary: (reportId: string) => Promise<string>;
  generateHealthOverview: () => Promise<string>;
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  emergencyProfile: EmergencyProfile;
  updateEmergencyProfile: (profile: EmergencyProfile) => void;
  sharedRecords: SharedRecord[];
  shareRecord: (record: Omit<SharedRecord, "id" | "sharedAt">) => void;
  addDoctorComment: (shareId: string, comment: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vitals, setVitals] = useState<VitalRecord[]>(INITIAL_VITALS);
  const [reports, setReports] = useState<MedicalReport[]>(INITIAL_REPORTS);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyProfile>({
    bloodGroup: "O+",
    allergies: "Penicillin",
    medications: "Metformin 500mg",
    healthProblems: "Type 2 Diabetes",
    emergencyContact: "+91 98765 43210 (Sister)"
  });
  const [sharedRecords, setSharedRecords] = useState<SharedRecord[]>([]);

  const login = (role: UserRole) => {
    if (role === "patient") setCurrentUser(MOCK_PATIENT);
    if (role === "doctor") setCurrentUser(MOCK_DOCTOR);
    if (role === "lab") setCurrentUser(MOCK_LAB);
  };

  const logout = () => setCurrentUser(null);

  const addVital = (vital: Omit<VitalRecord, "id">) => {
    const newVital = { ...vital, id: `v${Date.now()}` };
    setVitals([...vitals, newVital]);
  };

  const addReport = (report: Omit<MedicalReport, "id" | "summary">) => {
    const newReport = { ...report, id: `r${Date.now()}` };
    setReports([newReport, ...reports]);
  };

  const requestAccess = (patientId: string) => {
    if (currentUser?.role !== "doctor") return;
    const newRequest: AccessRequest = {
      id: `req${Date.now()}`,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      patientId,
      status: "pending",
      date: format(new Date(), "yyyy-MM-dd")
    };
    setAccessRequests([...accessRequests, newRequest]);
  };

  const updateAccessStatus = (requestId: string, status: "approved" | "denied") => {
    setAccessRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
  };

  const addReminder = (reminder: Omit<Reminder, "id">) => {
    setReminders([...reminders, { ...reminder, id: `rem${Date.now()}` }]);
  };

  const updateEmergencyProfile = (profile: EmergencyProfile) => {
    setEmergencyProfile(profile);
  };

  const shareRecord = (record: Omit<SharedRecord, "id" | "sharedAt">) => {
    setSharedRecords([...sharedRecords, { ...record, id: `share${Date.now()}`, sharedAt: new Date().toISOString() }]);
  };

  const addDoctorComment = (shareId: string, comment: string) => {
    setSharedRecords(prev => prev.map(s => s.id === shareId ? { ...s, doctorComment: comment } : s));
  };

  const generateAISummary = async (reportId: string) => {
    // Mock API call latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    return "Based on the report analysis: The values indicate a stable trend compared to previous records. However, the slightly elevated cholesterol warrants monitoring. (AI Generated - Not a Diagnosis)";
  };

  const generateHealthOverview = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return `
    **Monthly Health Summary - January 2026**

    **Stability Analysis:**
    - **Blood Pressure:** Your systolic BP has remained within the 118-125 range for the past 6 months, showing excellent stability.
    - **Weight:** Consistent at ~72kg, no significant fluctuations.
    - **Blood Sugar:** Fasting sugar levels are well-controlled (90-95 mg/dL average).

    **Areas of Note:**
    - **Lipid Profile:** Your latest report (Jan 10, 2026) shows borderline high cholesterol. Compared to your 2024 records, this is a 5% increase.
    - **SpO2:** Consistently healthy at 98-99%.

    *Disclaimer: This summary is generated by AI (Google Gemini 3 model) for informational purposes only and does not constitute medical advice.*
    `;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      vitals,
      addVital,
      reports,
      addReport,
      accessRequests,
      requestAccess,
      updateAccessStatus,
      generateAISummary,
      generateHealthOverview,
      reminders,
      addReminder,
      emergencyProfile,
      updateEmergencyProfile,
      sharedRecords,
      shareRecord,
      addDoctorComment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
