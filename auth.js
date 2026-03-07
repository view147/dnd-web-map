import { auth } from "../firebase/firebase-config.js"
import { signInWithPopup, GoogleAuthProvider, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"

const provider = new GoogleAuthProvider()

const loginBtn = document.getElementById("loginBtn")
const logoutBtn = document.getElementById("logoutBtn")

loginBtn.onclick = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        console.log("Logged in:", result.user)
    })
    .catch((error) => {
        console.error(error)
    })
}

logoutBtn.onclick = () => {
    signOut(auth)
    .then(() => {
        console.log("Logged out")
    })
    .catch((error) => {
        console.error(error)
    })
}
