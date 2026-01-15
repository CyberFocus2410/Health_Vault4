// client/src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * This configuration safely reads Firebase keys from environment variables.
 * It supports both Vite-style envs and Replit Secrets.
 */
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    (process.env.FIREBASE_API_KEY as string),

  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    (process.env.FIREBASE_AUTH_DOMAIN as string),

  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    (process.env.FIREBASE_PROJECT_ID as string),

  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    (process.env.FIREBASE_STORAGE_BUCKET as string),

  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    (process.env.FIREBASE_APP_ID as string),
};

/**
 * Initialize Firebase only once (important for React hot reloads)
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Export Firebase services to be used across the app
 */
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
