const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// โหลดข้อมูล
let data = JSON.parse(fs.readFileSync("data.json"));

// สร้างตัวละคร
app.post("/character", (req, res) => {
  const character = {
    id: Date.now(),
    name: req.body.name,
    hp: 100
  };
  data.characters.push(character);
  save();
  res.json(character);
});

// ดูตัวละครทั้งหมด
app.get("/character", (req, res) => {
  res.json(data.characters);
});

// ทอยลูกเต๋า
app.post("/dice", (req, res) => {
  const sides = req.body.sides || 20;
  const roll = Math.floor(Math.random() * sides) + 1;
  res.json({ roll });
});

function save() {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const USERS_FILE = "users.json";

// โหลดผู้ใช้
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// สมัครสมาชิก
app.post("/register", (req, res) => {
  const { username, passwordHash } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "มีผู้ใช้นี้แล้ว" });
  }

  users.push({ username, passwordHash });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ success: true });
});

// ล็อกอิน
app.post("/login", (req, res) => {
  const { username, passwordHash } = req.body;
  const users = loadUsers();

  const user = users.find(
    u => u.username === username && u.passwordHash === passwordHash
  );

  if (!user) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
