// gm_panel.ts
import { GameState, Phase } from "../engine/game_state";
import { TurnManager } from "../engine/turn_manager";

/* =========================
   FLOW OVERRIDE
   ========================= */

export function gmSetPhase(state: GameState, phase: Phase) {
  TurnManager.setPhase(state, phase);

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `forces phase to ${phase}`
  });
}

export function gmNextTurn(state: GameState) {
  TurnManager.nextTurn(state);

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: "forces next turn"
  });
}

export function gmSetActivePlayer(state: GameState, playerId: string) {
  state.turn.activePlayerId = playerId;

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `sets active player to ${playerId}`
  });
}

/* =========================
   ACTION CONTROL
   ========================= */

export function gmApproveAction(
  state: GameState,
  playerId: string,
  action: string,
  result: string
) {
  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `approves ${playerId}'s action "${action}" → ${result}`
  });
}

export function gmRejectAction(
  state: GameState,
  playerId: string,
  action: string,
  reason: string
) {
  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `rejects ${playerId}'s action "${action}" (${reason})`
  });
}

/* =========================
   PUNISH / BLESS
   ========================= */

export function gmDamagePlayer(
  state: GameState,
  playerId: string,
  amount: number,
  reason?: string
) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  player.hp = Math.max(0, player.hp - amount);

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `${player.name} takes ${amount} damage${reason ? ` (${reason})` : ""}`
  });
}

export function gmHealPlayer(
  state: GameState,
  playerId: string,
  amount: number,
  reason?: string
) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  player.hp = Math.min(player.maxHp, player.hp + amount);

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `${player.name} heals ${amount} HP${reason ? ` (${reason})` : ""}`
  });
}

export function gmModifyInfection(
  state: GameState,
  playerId: string,
  delta: number,
  reason?: string
) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  player.infectionStage += delta;

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `${player.name}'s infection ${delta > 0 ? "increases" : "decreases"} by ${Math.abs(delta)}${reason ? ` (${reason})` : ""}`
  });
}

export function gmAddStatus(
  state: GameState,
  playerId: string,
  status: string
) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  if (!player.status.includes(status)) {
    player.status.push(status);
  }

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `${player.name} gains status: ${status}`
  });
}

export function gmRemoveStatus(
  state: GameState,
  playerId: string,
  status: string
) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  player.status = player.status.filter(s => s !== status);

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `${player.name} loses status: ${status}`
  });
}

/* =========================
   STORY / ENDING CONTROL
   ========================= */

export function gmFlagEnding(
  state: GameState,
  endingKey: string
) {
  state.flags[endingKey] = true;

  state.logs.push({
    time: Date.now(),
    source: "GM",
    message: `flags ending condition: ${endingKey}`
  });
}
