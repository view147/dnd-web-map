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
