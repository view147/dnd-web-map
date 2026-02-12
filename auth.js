const API_URL = "http://localhost:3000";

// ===== LOGIN =====
async function login() {
  const username = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;

  if (!username || !password) {
    alert("กรุณากรอก Username และ Password");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Username หรือ Password ผิด");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);

    window.location.href = "main.html";
  } catch (err) {
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }
}

// ===== REGISTER =====
async function register() {
  const username = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;

  if (!username || !password) {
    alert("กรุณากรอก Username และ Password");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("มีผู้ใช้นี้แล้ว");
      return;
    }

    alert("สมัครสำเร็จ");
    window.location.href = "login.html";
  } catch (err) {
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }
}

// ===== NAVIGATION =====
function goRegister() {
  window.location.href = "register.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

// ===== AUTO BIND TOP BAR LOGIN =====
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".login");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
