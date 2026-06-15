import { GameState } from "../engine/game_state";
import { TurnManager } from "../engine/turn_manager";

export function gmSetPhase(state: GameState, phase: any) {
  TurnManager.setPhase(state, phase);
}

export function gmNextTurn(state: GameState) {
  TurnManager.nextTurn(state);
}
