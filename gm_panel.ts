// gm_panel.ts
import {
  GameState,
  setGamePhase,
  addGMNote,
  triggerEnding,
} from "./engine/game_state";
import { TurnManager } from "./engine/turn_manager";
import { InfectionEngine } from "./engine/infection_engine";
import { GameEvent } from "./engine/event_engine";

/* =========================
   Types
   ========================= */

export interface GMPanelConfig {
  onGMEvent: (event: GameEvent, choiceId: string) => void;
  onForceEnd: () => void;
}

/* =========================
   Bind (called from index.ts)
   ========================= */

export function bindGMPanel(config: GMPanelConfig) {
  // Force end turn
  document.getElementById("gm-force-end")?.addEventListener("click", () => {
    config.onForceEnd();
  });

  // Advance time
  document.getElementById("gm-advance-time")?.addEventListener("click", () => {
    // handled via onForceEnd flow
    config.onForceEnd();
  });
}

/* =========================
   GM Direct Actions
   (called programmatically by GM)
   ========================= */

export function gmSetPhase(state: GameState, phase: Parameters<typeof setGamePhase>[1]) {
  setGamePhase(state, phase);
  addGMNote(state, `GM forces phase → ${phase}`);
}

export function gmAdvanceTime(state: GameState) {
  TurnManager.advanceTime(state);
  addGMNote(state, `GM advances time → Day ${state.world.day} ${state.world.time}`);
}

export function gmSetActivePlayer(state: GameState, playerId: string) {
  state.turnState.activePlayerId = playerId;
  addGMNote(state, `GM sets active player → ${playerId}`);
}

/* =========================
   Player Manipulation
   ========================= */

export function gmDamagePlayer(
  state: GameState,
  playerId: string,
  amount: number,
  reason?: string
) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;

  player.status.hp = Math.max(0, player.status.hp - amount);
  if (player.status.hp <= 0) player.alive = false;

  addGMNote(state, `${player.name} takes ${amount} damage${reason ? ` (${reason})` : ""}`);
}

export function gmHealPlayer(
  state: GameState,
  playerId: string,
  amount: number,
  reason?: string
) {
  const player = state.players.find(p => p.id === playerId);
  if (!player || !player.alive) return;

  player.status.hp = Math.min(player.status.maxHp, player.status.hp + amount);

  addGMNote(state, `${player.name} heals ${amount} HP${reason ? ` (${reason})` : ""}`);
}

export function gmInfectPlayer(
  state: GameState,
  playerId: string,
  stage: number = 1,
  reason?: string
) {
  InfectionEngine.infectPlayer(state, playerId, stage);

  const player = state.players.find(p => p.id === playerId);
  addGMNote(state, `${player?.name ?? playerId} infected at stage ${stage}${reason ? ` (${reason})` : ""}`);
}

export function gmRestrainPlayer(state: GameState, playerId: string) {
  InfectionEngine.restrainInfection(state, playerId);

  const player = state.players.find(p => p.id === playerId);
  addGMNote(state, `${player?.name ?? playerId} infection restrained`);
}

/* =========================
   Ending Control
   ========================= */

export function gmFlagEnding(
  state: GameState,
  type: "ERADICATION" | "ESCAPE" | "EXTINCTION",
  description: string
) {
  triggerEnding(state, type, description);
  addGMNote(state, `GM triggers ending: ${type}`);
}
