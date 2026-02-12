const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DATA_FILE = "data.json";
const USERS_FILE = "users.json";

/* ======================
   LOAD / SAVE
====================== */
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ characters: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/* ======================
   AUTH
====================== */
app.post("/register", (req, res) => {
  const { username, passwordHash } = req.body;
  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "มีผู้ใช้นี้แล้ว" });
  }

  users.push({ username, passwordHash });
  saveUsers(users);

  res.json({ success: true });
});

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

/* ======================
   CHARACTER
====================== */
app.post("/character", (req, res) => {
  const data = loadData();

  const character = {
    id: Date.now(),
    name: req.body.name || "Unnamed",
    hp: 100
  };

  data.characters.push(character);
  saveData(data);

  res.json(character);
});

app.get("/character", (req, res) => {
  const data = loadData();
  res.json(data.characters);
});

/* ======================
   DICE
====================== */
app.post("/dice", (req, res) => {
  const sides = req.body.sides || 20;
  const roll = Math.floor(Math.random() * sides) + 1;
  res.json({ roll });
});

/* ======================
   START SERVER
====================== */
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
