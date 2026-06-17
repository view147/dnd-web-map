// index.ts (GM version)
// ============================================================
// GM login → โหลด/บันทึก state จาก Firestore
// ทุกครั้งที่ GM กด action → saveGameState → ผู้เล่นเห็นทันที
// ============================================================

import {
  GameState,
  createInitialGameState,
  setGamePhase,
  setTurnOwner,
  addGMNote,
} from "./engine/game_state";

import { TurnManager } from "./engine/turn_manager";
import { CombatEngine, CombatAction } from "./engine/combat_engine";
import { ContentLoader, SeasonContent } from "./engine/content_loader";

import { render, initRender } from "./render";
import { bindControls } from "./controls";
import { bindGMPanel, populateEventSelect, populatePlayerSelect } from "./gm_panel";
import { login, logout, onAuthChanged } from "./auth";
import { saveGameState, loadGameState } from "./db";

// ============================================================
// State
// ============================================================

let gameState: GameState;
let seasonContent: SeasonContent | null = null;

// ============================================================
// Auth Gate
// ============================================================

onAuthChanged(async (user, profile) => {
  if (!user || !profile) {
    showLogin();
    return;
  }
  if (profile.role !== "gm") {
    document.getElementById("login-error")!.textContent =
      "account นี้ไม่ใช่ GM — กรุณาเปิด player.html แทน";
    await logout();
    return;
  }
  showGM();
  await boot();
});

document.getElementById("btn-gm-login")?.addEventListener("click", async () => {
  const email = (document.getElementById("gm-email") as HTMLInputElement).value.trim();
  const pw = (document.getElementById("gm-password") as HTMLInputElement).value;
  const err = document.getElementById("login-error")!;
  err.textContent = "";
  try {
    await login(email, pw);
  } catch (e: any) {
    err.textContent = "Login ไม่สำเร็จ: " + (e.message ?? "ลองใหม่");
  }
});

document.getElementById("btn-gm-logout")?.addEventListener("click", async () => {
  await logout();
});

// ============================================================
// Boot (หลัง GM login)
// ============================================================

export async function boot() {
  initRender("app");

  // โหลด state จาก Firestore ถ้ามี ถ้าไม่มีสร้างใหม่
  const saved = await loadGameState();
  if (saved) {
    gameState = saved;
    addGMNote(gameState, "✅ โหลด session จาก Firestore สำเร็จ");
  } else {
    gameState = createInitialGameState(
      "game_" + Date.now(),
      "season_1",
      [
        { id: "p1", name: "Dr. Lin", role: "Medic" },
        { id: "p2", name: "Kael", role: "Soldier" },
        { id: "p3", name: "Echo", role: "Engineer" },
      ],
      "abandoned_city",
      "entrance"
    );
    setGamePhase(gameState, "EXPLORATION");
    setTurnOwner(gameState, "PLAYER");
    addGMNote(gameState, "🆕 เริ่ม session ใหม่");
  }

  // โหลด content
  try {
    seasonContent = await ContentLoader.loadSeason("season_1");
    ContentLoader.applySeasonToState(gameState, seasonContent);
  } catch {
    addGMNote(gameState, "⚠️ โหลด content ไม่ได้ — รันแบบ standalone");
  }

  // Bind
  bindGMPanel({
    getState: () => gameState,
    getContent: () => seasonContent,
    onStateChanged: async () => {
      await saveGameState(gameState); // บันทึกทันที → ผู้เล่นเห็นพร้อมกัน
      renderAll();
    },
  });

  bindControls({
    onPlayerAction: async (action: CombatAction) => {
      if (gameState.phase !== "COMBAT") return;
      const result = CombatEngine.resolveAction(gameState, action);
      addGMNote(gameState, result.message);
      await saveGameState(gameState);
      renderAll();
    },
    onEndTurn: async () => {
      TurnManager.startNewTurn(gameState);
      TurnManager.advanceTime(gameState);
      addGMNote(gameState, `--- TURN ${gameState.turnState.turn} | Day ${gameState.world.day} ${gameState.world.time} ---`);
      await saveGameState(gameState);
      renderAll();
    },
  });

  addGMNote(gameState, `--- TURN ${gameState.turnState.turn} START ---`);
  await saveGameState(gameState);
  renderAll();
}

// ============================================================
// Render
// ============================================================

function renderAll() {
  render(gameState);
  populatePlayerSelect(gameState);
  if (seasonContent) populateEventSelect(seasonContent, gameState);
}

// ============================================================
// Show/Hide
// ============================================================

function showLogin() {
  document.getElementById("gm-login-screen")!.style.display = "flex";
  document.getElementById("gm-game-screen")!.style.display = "none";
}

function showGM() {
  document.getElementById("gm-login-screen")!.style.display = "none";
  document.getElementById("gm-game-screen")!.style.display = "block";
}
