/* =========================
   PLAYER LOGIN SYSTEM
   (Firebase Firestore)
========================= */

import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =====================
   REGISTER
===================== */
window.register = async function () {
  const name = document.getElementById("playerName").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const msg = document.getElementById("msg");

  if (!name || !pin) {
    msg.textContent = "กรุณากรอกชื่อและ PIN";
    return;
  }

  if (pin.length !== 6) {
    msg.textContent = "PIN ต้อง 6 ตัว";
    return;
  }

  const ref = doc(db, "players", name);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    msg.textContent = "ชื่อนี้ถูกใช้แล้ว";
    return;
  }

  await setDoc(ref, {
    pin,
    createdAt: Date.now()
  });

  localStorage.setItem("player", name);
  msg.textContent = "สมัครสำเร็จ!";
  window.location.href = "index.html";
};

/* =====================
   LOGIN
===================== */
window.login = async function () {
  const name = document.getElementById("playerName").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const msg = document.getElementById("msg");

  const ref = doc(db, "players", name);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    msg.textContent = "ไม่พบผู้เล่น";
    return;
  }

  if (snap.data().pin !== pin) {
    msg.textContent = "PIN ไม่ถูกต้อง";
    return;
  }

  localStorage.setItem("player", name);
  window.location.href = "index.html";
};

/* =====================
   LOGOUT
===================== */
window.logout = function () {
  localStorage.removeItem("player");
  window.location.href = "login.html";
};

/* =====================
   AUTH CHECK
===================== */
window.getPlayer = function () {
  return localStorage.getItem("player");
};
