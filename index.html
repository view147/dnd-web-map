// index.ts
// Bind Engine ↔ UI ↔ GM
// This file is the ONLY place that knows everything.

import { GameState, createInitialGameState } from "./engine/game_state";
import { TurnManager } from "./engine/turn_manager";
import { CombatEngine } from "./engine/combat_engine";
import { InfectionEngine } from "./engine/infection_engine";
import { EventEngine } from "./engine/event_engine";
import { WorldEngine } from "./engine/world_engine";
import { EndingEngine } from "./engine/ending_engine";

import { renderGame } from "./render";
import { bindControls } from "./controls";
import { bindGMPanel } from "./gm_panel";

// ==============================
// GLOBAL SINGLETON (runtime only)
// ==============================

let gameState: GameState;
let turnManager: TurnManager;

// ==============================
// BOOTSTRAP
// ==============================

function boot() {
  console.log("[BOOT] The Flood starting...");

  // 1️⃣ Load content (season)
  const seasonId = "season_1";

  // 2️⃣ Create initial game state
  gameState = createInitialGameState(seasonId);

  // 3️⃣ Create engines
  const combatEngine = new CombatEngine();
  const infectionEngine = new InfectionEngine();
  const eventEngine = new EventEngine();
  const worldEngine = new WorldEngine();
  const endingEngine = new EndingEngine();

  // 4️⃣ Create turn manager
  turnManager = new TurnManager({
    combatEngine,
    infectionEngine,
    eventEngine,
    worldEngine,
    endingEngine,
  });

  // 5️⃣ Bind UI
  bindControls({
    onPlayerAction,
    onEndTurn,
  });

  bindGMPanel({
    onGMEvent,
    onForceEnd,
  });

  // 6️⃣ Start first turn
  startNewTurn();
}

// ==============================
// TURN FLOW
// ==============================

function startNewTurn() {
  turnManager.startTurn(gameState);

  log(`--- TURN ${gameState.turn} START ---`);
  render();
}

function onPlayerAction(action: any) {
  if (gameState.phase !== "PLAYER") {
    log("⛔ Not player phase");
    return;
  }

  turnManager.handlePlayerAction(gameState, action);

  render();
}

function onEndTurn() {
  if (gameState.phase !== "PLAYER") return;

  turnManager.endPlayerPhase(gameState);
  runWorldPhase();
}

function runWorldPhase() {
  turnManager.runWorldPhase(gameState);

  // GM phase (manual)
  gameState.phase = "GM";
  log("🧠 GM Phase: waiting for GM input");

  render();
}

function onGMEvent(event: any) {
  if (gameState.phase !== "GM") return;

  turnManager.applyGMEvent(gameState, event);

  render();
}

function onForceEnd() {
  if (gameState.phase !== "GM") return;

  turnManager.endTurn(gameState);

  // Check ending
  if (gameState.ending) {
    render();
    log(`🏁 ENDING: ${gameState.ending}`);
    return;
  }

  startNewTurn();
}

// ==============================
// RENDER + LOG
// ==============================

function render() {
  renderGame(gameState);
}

function log(message: string) {
  gameState.log.push(message);
  console.log(message);
}

// ==============================
// START GAME
// ==============================

boot();
