// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXNRDQvVyfnQKo_aUWP_bKAo4Np3oMXac",
  authDomain: "dnd-view-web.firebaseapp.com",
  projectId: "dnd-view-web",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
