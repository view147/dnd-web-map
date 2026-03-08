import { app } from "../firebase/firebase-config.js"

import {
getAuth,
signInWithPopup,
GoogleAuthProvider,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

document.getElementById("loginBtn").onclick = () => {

signInWithPopup(auth, provider)

}

document.getElementById("logoutBtn").onclick = () => {

signOut(auth)

}
