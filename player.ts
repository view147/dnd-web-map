// player.ts
// ============================================================
// หน้าจอผู้เล่น — เห็นเฉพาะตัวละครตัวเอง + สถานะโลก
// State sync realtime จาก Firestore
// ============================================================

import { login, logout, onAuthChanged, UserProfile, loadPlayerNote, savePlayerNote } from "./auth";
import { watchGameState } from "./db";
import { GameState, PlayerState } from "./engine/game_state";

let currentProfile: UserProfile | null = null;
let myPlayer: PlayerState | null = null;

// ============================================================
// Boot
// ============================================================

onAuthChanged(async (user, profile) => {
  if (!user || !profile) {
    showLogin();
    return;
  }
  if (profile.role !== "player") {
    showError("account นี้เป็น GM — กรุณาเปิด gm.html แทน");
    return;
  }
  currentProfile = profile;
  showGame();
  startWatching();
  loadNote();
});

// ============================================================
// Login / Logout
// ============================================================

document.getElementById("btn-login")?.addEventListener("click", async () => {
  const email = (document.getElementById("login-email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("login-password") as HTMLInputElement).value;
  const errEl = document.getElementById("login-error")!;
  errEl.textContent = "";

  try {
    await login(email, password);
  } catch (e: any) {
    errEl.textContent = "Login ไม่สำเร็จ: " + (e.message ?? "กรุณาลองใหม่");
  }
});

document.getElementById("btn-logout")?.addEventListener("click", async () => {
  await logout();
});

// ============================================================
// Watch Game State (realtime)
// ============================================================

function startWatching() {
  watchGameState((state) => {
    renderGame(state);
  });
}

// ============================================================
// Render
// ============================================================

function renderGame(state: GameState) {
  // Header
  setText("p-turn", String(state.turnState.turn));
  setText("p-day", String(state.world.day));
  setText("p-time", state.world.time);

  // Phase banner
  const banner = document.getElementById("phase-banner")!;
  banner.textContent = `— ${state.phase} —`;
  banner.className = state.phase === "COMBAT" ? "combat" : state.phase === "EVENT" ? "event" : "";

  // Ending
  if (state.ending.triggered) {
    const notice = document.getElementById("ending-notice")!;
    notice.style.display = "block";
    setText("p-ending-type", state.ending.type ?? "");
  }

  // World
  setText("p-map", state.world.mapId);
  setText("p-loc", state.world.locationId);
  setText("p-ginf-val", String(state.world.globalInfectionLevel));
  setWidth("p-ginf-fill", state.world.globalInfectionLevel);

  // Find my character
  const charId = currentProfile?.characterId;
  const player = charId
    ? state.players.find(p => p.id === charId)
    : state.players[0]; // fallback

  if (player) {
    myPlayer = player;
    renderCharacter(player);
  }

  // Log (last 20)
  renderLog(state.gmNotes);
}

function renderCharacter(p: PlayerState) {
  setText("p-char-name", p.name);
  setText("p-char-role", p.role);

  const hpPct = Math.round((p.status.hp / p.status.maxHp) * 100);
  const stPct = Math.round((p.status.stamina / p.status.maxStamina) * 100);
  const infPct = Math.min(100, p.status.infectionStage * 25);

  setText("p-hp-val", `${p.status.hp} / ${p.status.maxHp}`);
  setText("p-st-val", `${p.status.stamina} / ${p.status.maxStamina}`);
  setText("p-inf-val", p.status.infected ? `Stage ${p.status.infectionStage}` : "ปกติ");

  setWidth("p-hp-bar", hpPct);
  setWidth("p-st-bar", stPct);
  setWidth("p-inf-bar", infPct);

  // Tags
  const tags = document.getElementById("p-status-tags")!;
  const tagList: string[] = [];
  if (!p.alive) tagList.push(`<span class="stag dead">💀 เสียชีวิต</span>`);
  else tagList.push(`<span class="stag alive">✅ มีชีวิต</span>`);
  if (p.status.infected) tagList.push(`<span class="stag infected">☣ ติดเชื้อ</span>`);
  if (p.status.restrained) tagList.push(`<span class="stag restrained">🩹 มัดเชื้อแล้ว</span>`);
  tags.innerHTML = tagList.join("");

  // Inventory
  const inv = document.getElementById("p-inventory")!;
  inv.innerHTML = p.inventory.length === 0
    ? `<div class="inv-empty">ไม่มีไอเทม</div>`
    : p.inventory.map(i => `<div class="inv-item">▸ ${i}</div>`).join("");
}

function renderLog(notes: string[]) {
  const el = document.getElementById("p-log-entries")!;
  const last20 = notes.slice(-20).reverse();
  el.innerHTML = last20.map(n =>
    `<div class="lentry">${n}</div>`
  ).join("");
}

// ============================================================
// Player Notes (ส่วนตัว GM ไม่เห็น)
// ============================================================

async function loadNote() {
  const charId = currentProfile?.characterId ?? currentProfile?.uid ?? "";
  const note = await loadPlayerNote(charId);
  (document.getElementById("player-note") as HTMLTextAreaElement).value = note;
}

document.getElementById("btn-save-note")?.addEventListener("click", async () => {
  const charId = currentProfile?.characterId ?? currentProfile?.uid ?? "";
  const note = (document.getElementById("player-note") as HTMLTextAreaElement).value;
  await savePlayerNote(charId, note);
  const saved = document.getElementById("note-saved")!;
  saved.textContent = "บันทึกแล้ว ✓";
  setTimeout(() => { saved.textContent = ""; }, 2000);
});

// ============================================================
// Show / Hide Screens
// ============================================================

function showLogin() {
  document.getElementById("login-screen")!.style.display = "flex";
  document.getElementById("game-screen")!.style.display = "none";
}

function showGame() {
  document.getElementById("login-screen")!.style.display = "none";
  document.getElementById("game-screen")!.style.display = "block";
}

function showError(msg: string) {
  document.getElementById("login-error")!.textContent = msg;
}

// ============================================================
// DOM Helpers
// ============================================================

function setText(id: string, val: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setWidth(id: string, pct: number) {
  const el = document.getElementById(id) as HTMLElement | null;
  if (el) el.style.width = `${Math.max(0, Math.min(100, pct))}%`;
}
