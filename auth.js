function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  // ตัวอย่างล็อกอินปลอมก่อน
  if (user === "admin" && pass === "1234") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "main.html";
  } else {
    alert("Username หรือ Password ผิด");
  }
}

function goRegister() {
  window.location.href = "register.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

