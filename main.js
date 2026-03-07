import { auth } from "../firebase/firebase-config.js"
import { onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"

console.log("View RPG loaded")

const loginBtn = document.getElementById("loginBtn")
const logoutBtn = document.getElementById("logoutBtn")

onAuthStateChanged(auth, (user) => {

    if (user) {
        console.log("User logged in:", user.email)

        loginBtn.style.display = "none"
        logoutBtn.style.display = "inline-block"
    } 
    else {
        console.log("User not logged in")

        loginBtn.style.display = "inline-block"
        logoutBtn.style.display = "none"
    }

})
