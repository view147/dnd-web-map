async function hashPassword(pass) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pass);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const hash = await hashPassword(pass);

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user,
      passwordHash: hash
    })
  });

  const data = await res.json();

  if (data.success) {
    // ล็อกอินผ่าน → เข้าเว็บหลัก
    window.location.href = "main.html";
  } else {
    alert("ชื่อหรือรหัสผิด");
  }
}
