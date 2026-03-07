import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

const firebaseConfig = {

apiKey: "AIzaSyD_ELoo4XEXn9Xoo7zulw7yG78yAsvDoEU",

authDomain: "dnd-pale-character-5ec73.firebaseapp.com",

projectId: "dnd-pale-character-5ec73",

storageBucket: "dnd-pale-character-5ec73.firebasestorage.app",

messagingSenderId: "514277998310",

appId: "1:514277998310:web:35ca063d3021cc70b9c527"

}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }
