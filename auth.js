/* =========================
   SIMPLE PLAYER AUTH SYSTEM
   (No email, no backend)
========================= */

// สุ่มรหัสผู้เล่น
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PALE-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* =====================
   REGISTER
===================== */
window.register = function () {
  const code = generateCode();

  localStorage.setItem("playerCode", code);
  localStorage.setItem("loggedIn", "true");

  alert(
    "🎲 Player Created!\n\n" +
    "Your Player Code:\n" +
    code +
    "\n\n⚠️ Please save this code!"
  );

  window.location.href = "index.html";
};

/* =====================
   LOGIN
===================== */
window.login = function () {
  const input = document.getElementById("playerCode").value.trim();
  const saved = localStorage.getItem("playerCode");
  const msg = document.getElementById("msg");

  if (!saved) {
    msg.textContent = "❌ No player found. Create one first.";
    return;
  }

  if (input === saved) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "index.html";
  } else {
    msg.textContent = "❌ Invalid Player Code";
  }
};

/* =====================
   LOGOUT
===================== */
window.logout = function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
};

/* =====================
   AUTH CHECK
===================== */
window.isLoggedIn = function () {
  return localStorage.getItem("loggedIn") === "true";
};
