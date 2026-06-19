// gm_panel.ts
// ============================================================
// GM Panel — เครื่องมือสำหรับ GM รันเกม
// GM เป็นคนตัดสินใจทุกอย่าง ระบบนี้แค่ช่วยให้ apply ผลได้เร็วขึ้น
// ============================================================

import {
  GameState,
  GamePhase,
  setGamePhase,
  addGMNote,
  triggerEnding,
} from "./engine/game_state";
import { TurnManager } from "./engine/turn_manager";
import { InfectionEngine } from "./engine/infection_engine";
import { EventEngine, GameEvent } from "./engine/event_engine";
import { EndingEngine } from "./engine/ending_engine";
import { ContentLoader, SeasonContent } from "./engine/content_loader";

export interface GMPanelConfig {
  getState: () => GameState;
  getContent: () => SeasonContent | null;
  onStateChanged: () => void;
}

export function bindGMPanel(config: GMPanelConfig) {
  const { getState, getContent, onStateChanged } = config;

  document.getElementById("gm-phase-select")?.addEventListener("change", (e) => {
    const phase = (e.target as HTMLSelectElement).value as GamePhase;
    const state = getState();
    setGamePhase(state, phase);
    addGMNote(state, `GM เปลี่ยน phase → ${phase}`);
    onStateChanged();
  });

  document.getElementById("btn-end-turn")?.addEventListener("click", () => {
    const state = getState();
    TurnManager.startNewTurn(state);
    TurnManager.advanceTime(state);
    addGMNote(state, `--- TURN ${state.turnState.turn} | Day ${state.world.day} ${state.world.time} ---`);
    onStateChanged();
  });

  document.getElementById("btn-attack")?.addEventListener("click", () => {
    const state = getState();
    const playerId = getSelectedPlayer();
    const amount = getInputNumber("input-damage");
    if (!playerId) return;
    gmDamagePlayer(state, playerId, amount, "GM");
    onStateChanged();
  });

  document.getElementById("btn-heal")?.addEventListener("click", () => {
    const state = getState();
    const playerId = getSelectedPlayer();
    const amount = getInputNumber("input-heal");
    if (!playerId) return;
    gmHealPlayer(state, playerId, amount);
    onStateChanged();
  });

  document.getElementById("btn-infect")?.addEventListener("click", () => {
    const state = getState();
    const playerId = getSelectedPlayer();
    if (!playerId) return;
    gmInfectPlayer(state, playerId, 1);
    onStateChanged();
  });

  document.getElementById("btn-stage-up")?.addEventListener("click", () => {
    const state = getState();
    const playerId = getSelectedPlayer();
    if (!playerId) return;
    InfectionEngine.increaseStage(state, playerId, 1);
    const player = state.players.find(p => p.id === playerId);
    addGMNote(state, `${player?.name} infection stage → ${player?.status.infectionStage}`);
    onStateChanged();
  });

  document.getElementById("btn-restrain")?.addEventListener("click", () => {
    const state = getState();
    const playerId = getSelectedPlayer();
    if (!playerId) return;
    gmRestrainPlayer(state, playerId);
    onStateChanged();
  });

  document.getElementById("btn-kill")?.addEventListener("click", () => {
    const state = getState();
    const playerId = getSelectedPlayer();
    if (!playerId) return;
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    player.alive = false;
    player.status.hp = 0;
    addGMNote(state, `💀 ${player.name} เสียชีวิต`);
    onStateChanged();
  });

  document.getElementById("btn-world-infect-up")?.addEventListener("click", () => {
    const state = getState();
    const amount = getInputNumber("input-world-infection");
    state.world.globalInfectionLevel = Math.min(100, state.world.globalInfectionLevel + amount);
    addGMNote(state, `☣ Global infection → ${state.world.globalInfectionLevel}`);
    onStateChanged();
  });

  document.getElementById("btn-world-infect-down")?.addEventListener("click", () => {
    const state = getState();
    const amount = getInputNumber("input-world-infection");
    state.world.globalInfectionLevel = Math.max(0, state.world.globalInfectionLevel - amount);
    addGMNote(state, `✅ Global infection → ${state.world.globalInfectionLevel}`);
    onStateChanged();
  });

  document.getElementById("btn-move-location")?.addEventListener("click", () => {
    const state = getState();
    const mapId = (document.getElementById("input-map-id") as HTMLInputElement)?.value.trim();
    const locId = (document.getElementById("input-loc-id") as HTMLInputElement)?.value.trim();
    if (!mapId || !locId) return;
    state.world.mapId = mapId;
    state.world.locationId = locId;
    addGMNote(state, `🗺 ย้ายไป ${mapId} / ${locId}`);
    onStateChanged();
  });

  document.getElementById("btn-apply-event")?.addEventListener("click", () => {
    const state = getState();
    const content = getContent();
    if (!content) return;

    const eventId = (document.getElementById("select-event") as HTMLSelectElement)?.value;
    const choiceId = (document.getElementById("select-choice") as HTMLSelectElement)?.value;
    if (!eventId || !choiceId) return;

    const event = ContentLoader.getEvent(content, eventId);
    if (!event) return;

    EventEngine.applyChoice(state, event as GameEvent, choiceId);
    addGMNote(state, `📋 Event: "${event.title}" → choice: ${choiceId}`);
    onStateChanged();
  });

  document.getElementById("select-event")?.addEventListener("change", () => {
    const content = getContent();
    if (!content) return;
    const eventId = (document.getElementById("select-event") as HTMLSelectElement)?.value;
    const event = ContentLoader.getEvent(content, eventId);
    updateChoiceSelect(event as GameEvent | null);
  });

  document.getElementById("btn-check-ending")?.addEventListener("click", () => {
    const state = getState();
    const result = EndingEngine.checkEnding(state);
    if (result) {
      triggerEnding(state, result.type, result.description);
      addGMNote(state, `🏁 ENDING triggered: ${result.type}`);
    } else {
      addGMNote(state, "ยังไม่ถึงจุดจบ — เกมดำเนินต่อ");
    }
    onStateChanged();
  });

  document.getElementById("btn-set-flag")?.addEventListener("click", () => {
    const state = getState();
    const key = (document.getElementById("input-flag-key") as HTMLInputElement)?.value.trim();
    const val = (document.getElementById("select-flag-val") as HTMLSelectElement)?.value === "true";
    if (!key) return;
    state.world.flags[key] = val;
    addGMNote(state, `🚩 Flag set: ${key} = ${val}`);
    onStateChanged();
  });
}

export function gmDamagePlayer(state: GameState, playerId: string, amount: number, reason?: string) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;
  player.status.hp = Math.max(0, player.status.hp - amount);
  if (player.status.hp <= 0) player.alive = false;
  addGMNote(state, `⚔ ${player.name} รับ ${amount} damage${reason ? ` (${reason})` : ""}`);
}

export function gmHealPlayer(state: GameState, playerId: string, amount: number) {
  const player = state.players.find(p => p.id === playerId);
  if (!player || !player.alive) return;
  player.status.hp = Math.min(player.status.maxHp, player.status.hp + amount);
  addGMNote(state, `💊 ${player.name} heal ${amount} HP`);
}

export function gmInfectPlayer(state: GameState, playerId: string, stage = 1) {
  InfectionEngine.infectPlayer(state, playerId, stage);
  const player = state.players.find(p => p.id === playerId);
  addGMNote(state, `☣ ${player?.name} ติดเชื้อ stage ${stage}`);
}

export function gmRestrainPlayer(state: GameState, playerId: string) {
  InfectionEngine.restrainInfection(state, playerId);
  const player = state.players.find(p => p.id === playerId);
  addGMNote(state, `🩹 ${player?.name} มัดเชื้อแล้ว`);
}

export function populateEventSelect(content: SeasonContent, state: GameState) {
  const sel = document.getElementById("select-event") as HTMLSelectElement;
  if (!sel) return;

  const available = ContentLoader.getAvailableEvents(state, content);
  sel.innerHTML = available.length === 0
    ? `<option value="">— ไม่มี event ที่ใช้ได้ตอนนี้ —</option>`
    : available.map(e => `<option value="${e.id}">${e.title}</option>`).join("");

  const first = available[0];
  updateChoiceSelect(first as GameEvent | null);
}

function updateChoiceSelect(event: GameEvent | null) {
  const sel = document.getElementById("select-choice") as HTMLSelectElement;
  if (!sel) return;
  if (!event) { sel.innerHTML = ""; return; }
  sel.innerHTML = event.choices.map(c =>
    `<option value="${c.id}">${c.description}</option>`
  ).join("");
}

export function populatePlayerSelect(state: GameState) {
  const sel = document.getElementById("select-source") as HTMLSelectElement;
  if (!sel) return;
  sel.innerHTML = state.players
    .filter(p => p.alive)
    .map(p => `<option value="${p.id}">${p.name} (${p.role})</option>`)
    .join("");
}

function getSelectedPlayer(): string | null {
  return (document.getElementById("select-source") as HTMLSelectElement)?.value || null;
}

function getInputNumber(id: string): number {
  return parseInt((document.getElementById(id) as HTMLInputElement)?.value ?? "0") || 0;
}
