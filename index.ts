// index.ts
// ============================================================
// Boot logic หลัง GM login แล้ว (เรียกจาก gm_login.ts)
// โหลด/บันทึก state จาก Firestore
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
import { saveGameState, loadGameState } from "./db";

let gameState: GameState;
let seasonContent: SeasonContent | null = null;

export async function boot() {
  initRender("app");

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

  try {
    seasonContent = await ContentLoader.loadSeason("season_1");
    ContentLoader.applySeasonToState(gameState, seasonContent);
  } catch {
    addGMNote(gameState, "⚠️ โหลด content ไม่ได้ — รันแบบ standalone");
  }

  bindGMPanel({
    getState: () => gameState,
    getContent: () => seasonContent,
    onStateChanged: async () => {
      await saveGameState(gameState);
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

function renderAll() {
  render(gameState);
  populatePlayerSelect(gameState);
  if (seasonContent) populateEventSelect(seasonContent, gameState);
}
