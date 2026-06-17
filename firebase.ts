// firebase.ts
// ============================================================
// เชื่อมต่อ Firebase — import ไฟล์นี้ที่เดียว
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwGVwLROVY5s2snYWxtNwAXpmJqMf2CXI",
  authDomain: "game-view-masaru.firebaseapp.com",
  projectId: "game-view-masaru",
  storageBucket: "game-view-masaru.firebasestorage.app",
  messagingSenderId: "854055376583",
  appId: "1:854055376583:web:8b7231e2ad0ef9bdc7d0e2",
  measurementId: "G-XTWHRJTNVX",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
