// auth.js
// ใช้ Firebase Auth (ไม่มี backend, ใช้กับ GitHub Pages)

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =====================
   LOGIN
===================== */
window.login = function () {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(window.auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("เข้าสู่ระบบไม่สำเร็จ");
      console.error(error.code, error.message);
    });
};

/* =====================
   REGISTER
===================== */
window.register = function () {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(window.auth, email, password)
    .then(() => {
      alert("สมัครสมาชิกสำเร็จ");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("สมัครสมาชิกไม่สำเร็จ (รหัสต้องอย่างน้อย 6 ตัว)");
      console.error(error.code, error.message);
    });
};

/* =====================
   LOGOUT
===================== */
window.logout = function () {
  signOut(window.auth).then(() => {
    window.location.href = "login.html";
  });
};
