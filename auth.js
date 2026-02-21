// auth.js (ใช้กับ Firebase Auth เท่านั้น)

// import Firebase Auth จาก CDN
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ดึง auth ที่ถูก init ไว้แล้วจาก firebase.js
const auth = window.auth;

/* =====================
   LOGIN
===================== */
window.login = function () {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "main.html";
    })
    .catch((error) => {
      alert("ล็อกอินไม่สำเร็จ");
      console.error(error);
    });
};

/* =====================
   REGISTER
===================== */
window.register = function () {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("สมัครสมาชิกสำเร็จ");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("สมัครไม่สำเร็จ");
      console.error(error);
    });
};

/* =====================
   LOGOUT
===================== */
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};
