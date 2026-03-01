// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDGBZ4rNXb9Ze9FRcIfZoz9aEcn9FKtYg",
  authDomain: "web-dnd-view.firebaseapp.com",
  projectId: "web-dnd-view",
  storageBucket: "web-dnd-view.firebasestorage.app",
  messagingSenderId: "827437332590",
  appId: "1:827437332590:web:009f28fd4e7a6c0b678e7f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
