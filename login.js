async function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  // เข้ารหัสรหัสผ่าน
  const encoder = new TextEncoder();
  const data = encoder.encode(pass);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  // ส่งไป backend (ตอนนี้ยังแค่โชว์)
  document.getElementById("result").innerText =
    "ส่งค่าแล้ว: " + user + " / " + hashHex;
}
