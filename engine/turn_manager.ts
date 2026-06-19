// ============================================================
// Turn Manager
// ------------------------------------------------------------
// - ควบคุม flow ของเทิร์น
// - เปลี่ยน phase / owner / active player
// - ไม่มี decision logic (GM เป็นคนตัดสิน)
// ============================================================

import {
  GameState,
  GamePhase,
  TurnOwner,
} from "./game_state";

export class TurnManager {
  /* -----------------------------
     Phase Control
     ----------------------------- */

  static setPhase(state: GameState, phase: GamePhase) {
    state.phase = phase;
    state.turnState.phase = phase;
  }

  /* -----------------------------
     Turn Control
     ----------------------------- */

  static startNewTurn(state: GameState) {
    state.turnState.turn += 1;
    state.turnState.activePlayerId = undefined;
  }

  static setTurnOwner(state: GameState, owner: TurnOwner) {
    state.turnState.owner = owner;
  }

  static setActivePlayer(
    state: GameState,
    playerId: string | undefined
  ) {
    state.turnState.activePlayerId = playerId;
  }

  /* -----------------------------
     Time Flow Helpers
     (GM-triggered only)
     ----------------------------- */

  static advanceTime(state: GameState) {
    const world = state.world;

    if (world.time === "MORNING") {
      world.time = "AFTERNOON";
    } else if (world.time === "AFTERNOON") {
      world.time = "NIGHT";
    } else {
      world.time = "MORNING";
      world.day += 1;
    }
  }
}
