// ===== LOGIN =====
function login() {
  const user = document.getElementById("username")?.value;
  const pass = document.getElementById("password")?.value;

  if (!user || !pass) {
    alert("กรุณากรอก Username และ Password");
    return;
  }

  // ล็อกอินแบบชั่วคราว
  if (user === "admin" && pass === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "main.html";
  } else {
    alert("Username หรือ Password ผิด");
  }
}

// ===== REGISTER =====
function goRegister() {
  window.location.href = "register.html";
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

// ===== AUTO BIND BUTTON =====
document.addEventListener("DOMContentLoaded", () => {
  // ปุ่ม Sign In บนแถบบน
  const loginBtn = document.querySelector(".login");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
});
