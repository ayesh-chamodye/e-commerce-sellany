import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCuWpBXg9o0VCst7mADZowKro5T3pt47CA",
  authDomain: "sellany-502609.firebaseapp.com",
  projectId: "sellany-502609",
  storageBucket: "sellany-502609.firebasestorage.app",
  messagingSenderId: "1098367987126",
  appId: "1:1098367987126:web:d2c460be73f42c139fa517",
  measurementId: "G-6XDPLV39JN"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
