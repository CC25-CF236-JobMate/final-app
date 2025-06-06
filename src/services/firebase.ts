// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTXPhPH0c9QZzmzixLjL79qQxr2a80VZk",
  authDomain: "capstone-jobseeker-dd654.firebaseapp.com",
  projectId: "capstone-jobseeker-dd654",
  storageBucket: "capstone-jobseeker-dd654.firebasestorage.app",
  messagingSenderId: "705829099986",
  appId: "1:705829099986:web:dbdb316775b17ce6e7d00b",
  measurementId: "G-RSGXMT6XW5"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { serverTimestamp };