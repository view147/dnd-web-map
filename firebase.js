// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDGBZ4rNXb9Ze9FRcIfZoz9aEcn9FKtYg",
  authDomain: "web-dnd-view.firebaseapp.com",
  projectId: "web-dnd-view",
  storageBucket: "web-dnd-view.firebasestorage.app",
  messagingSenderId: "647969315171",
  appId: "1:647969315171:web:05e540f8097270dec29b56"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
