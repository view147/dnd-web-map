// auth.js
// Firebase Auth only (GitHub Pages friendly)

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* =====================
   AUTH STATE (หัวใจหลัก)
   ทำงานเหมือน D&D Beyond
===================== */
onAuthStateChanged(window.auth, (user) => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userText = document.getElementById("userText");

  if (user) {
    // 🔓 ล็อกอินแล้ว
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userText) userText.textContent = `ยินดีต้อนรับ ${user.email}`;
  } else {
    // 🔒 ยังไม่ล็อกอิน
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";

    // ถ้าอยู่หน้า main / หน้า protected → เด้งไป login
    if (location.pathname.includes("main.html")) {
      window.location.href = "login.html";
    }
  }
});

/* =====================
   LOGIN
===================== */
window.login = function () {
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("กรุณากรอก Email และ Password");
    return;
  }

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
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("กรุณากรอก Email และ Password");
    return;
  }

  if (password.length < 6) {
    alert("รหัสผ่านต้องอย่างน้อย 6 ตัว");
    return;
  }

  createUserWithEmailAndPassword(window.auth, email, password)
    .then(() => {
      alert("สมัครสมาชิกสำเร็จ");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("สมัครสมาชิกไม่สำเร็จ");
      console.error(error.code, error.message);
    });
};

/* =====================
   LOGOUT
===================== */
window.logout = function () {
  signOut(window.auth).then(() => {
    window.location.href = "index.html";
  });
};
