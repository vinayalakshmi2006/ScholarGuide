import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8zxvKtxh53rgA5UunI1j0t0ueboQ1bCE",
  authDomain: "smartscholar-8dba2.firebaseapp.com",
  projectId: "smartscholar-8dba2",
  storageBucket: "smartscholar-8dba2.firebasestorage.app",
  messagingSenderId: "681404788020",
  appId: "1:681404788020:web:c8d4507affa644239a4961"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (using local fallback service mode):", error);
}

export { auth, db };
export default app;
