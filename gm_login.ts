// gm_login.ts
// GM login logic แยกออกมาจาก index.ts ให้ gm.html ใช้ได้ตรงๆ

import { login, logout, onAuthChanged } from "./auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// ── Auth gate ────────────────────────────────────────────────
onAuthChanged(async (_user, profile) => {
  if (!profile) {
    showLogin();
    return;
  }
  if (profile.role !== "gm") {
    setError("account นี้ไม่ใช่ GM — กรุณาเปิด player.html แทน");
    await logout();
    return;
  }
  showGM();

  // โหลด boot จาก index.ts
  const { boot } = await import("./index");
  boot();
});

// ── Login button ─────────────────────────────────────────────
document.getElementById("btn-gm-login")?.addEventListener("click", async () => {
  const email = (document.getElementById("gm-email") as HTMLInputElement).value.trim();
  const pw = (document.getElementById("gm-password") as HTMLInputElement).value;
  setError("");
  if (!email || !pw) { setError("กรุณากรอก email และ password"); return; }
  try {
    await login(email, pw);
  } catch (e: any) {
    setError("Login ไม่สำเร็จ: " + (e.message ?? "ลองใหม่อีกครั้ง"));
  }
});

// ── Logout button ────────────────────────────────────────────
document.getElementById("btn-gm-logout")?.addEventListener("click", async () => {
  await logout();
  location.reload();
});

// ── Post News ────────────────────────────────────────────────
document.getElementById("btn-post-news")?.addEventListener("click", async () => {
  const title = (document.getElementById("news-title") as HTMLInputElement).value.trim();
  const body = (document.getElementById("news-body") as HTMLTextAreaElement).value.trim();
  const tag = (document.getElementById("news-tag") as HTMLSelectElement).value;
  if (!title && !body) return;
  await addDoc(collection(db, "news"), {
    title, body, tag, createdAt: Date.now(),
  });
  (document.getElementById("news-title") as HTMLInputElement).value = "";
  (document.getElementById("news-body") as HTMLTextAreaElement).value = "";
});

// ── Helpers ──────────────────────────────────────────────────
function showLogin() {
  document.getElementById("gm-login-screen")!.style.display = "flex";
  document.getElementById("gm-game-screen")!.style.display = "none";
}

function showGM() {
  document.getElementById("gm-login-screen")!.style.display = "none";
  document.getElementById("gm-game-screen")!.style.display = "block";
}

function setError(msg: string) {
  document.getElementById("login-error")!.textContent = msg;
}
