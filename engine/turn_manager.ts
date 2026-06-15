// engine/turn_manager.ts
import { GameState, Phase } from "./game_state";

export class TurnManager {
  static setPhase(state: GameState, phase: Phase) {
    state.turn.phase = phase;
    state.logs.push({
      time: Date.now(),
      source: "SYSTEM",
      message: `Phase changed to ${phase}`
    });
  }

  static nextTurn(state: GameState) {
    state.turn.currentTurn += 1;
    state.turn.activePlayerId = null;

    state.logs.push({
      time: Date.now(),
      source: "SYSTEM",
      message: `Turn ${state.turn.currentTurn} begins`
    });
  }

  static setActivePlayer(state: GameState, playerId: string) {
    state.turn.activePlayerId = playerId;
  }
}
