const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

const USERS_FILE = "users.json";
const DATA_FILE = "data.json";

/* ======================
   UTILS
====================== */
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ characters: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* ======================
   AUTH : REGISTER
====================== */
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false });
  }

  const users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  users.push({
    username,
    passwordHash
  });

  saveUsers(users);
  res.json({ success: true });
});

/* ======================
   AUTH : LOGIN
====================== */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ success: false });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
});

/* ======================
   CHARACTER (เดิม)
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
   DICE (เดิม)
====================== */
app.post("/dice", (req, res) => {
  const sides = req.body.sides || 20;
  const roll = Math.floor(Math.random() * sides) + 1;
  res.json({ roll });
});

/* ======================
   START
====================== */
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});

