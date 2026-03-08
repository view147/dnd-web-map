import { app } from "../firebase/firebase-config.js"

import {
getAuth,
signInWithPopup,
GoogleAuthProvider,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

const loginBtn = document.getElementById("loginBtn")
const logoutBtn = document.getElementById("logoutBtn")

/* LOGIN */

if(loginBtn){

loginBtn.onclick = async () => {

try{

const result = await signInWithPopup(auth, provider)

console.log("User logged in:", result.user)

}catch(error){

console.error("Login error:", error)

}

}

}

/* LOGOUT */

if(logoutBtn){

logoutBtn.onclick = async () => {

try{

await signOut(auth)

console.log("User logged out")

}catch(error){

console.error("Logout error:", error)

}

}

}
