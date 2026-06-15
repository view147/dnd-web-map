// controls.ts
import { GameState, Phase } from "../engine/game_state";
import { TurnManager } from "../engine/turn_manager";
import { EventEngine } from "../engine/event_engine";
import { WorldEngine } from "../engine/world_engine";

let state: GameState;
let onUpdate: () => void;
let root: HTMLElement | null = null;

/**
 * เรียกจาก index.ts
 */
export function initControls(
  gameState: GameState,
  renderCallback: () => void,
  rootId: string = "controls"
) {
  state = gameState;
  onUpdate = renderCallback;

  root = document.getElementById(rootId);
  if (!root) throw new Error("Controls root not found");

  renderControls();
}

/* =========================
   CORE IDEA: DECLARE ACTION
   ========================= */

export function declareAction(playerId: string, action: string) {
  state.logs.push({
    time: Date.now(),
    source: playerId,
    message: `declares action: ${action}`
  });

  console.log(`Player ${playerId} declares ${action}`);
  onUpdate();
}

/* =========================
   UI CONTROLS
   ========================= */

function renderControls() {
  if (!root) return;

  root.innerHTML = `
    <div style="padding:10px; border-top:1px solid #444;">
      <h3>CONTROLS</h3>

      <div>
        <button id="nextTurn">Next Turn</button>
        <button id="phaseExplore">Explore</button>
        <button id="phaseCombat">Combat</button>
        <button id="phaseEvent">Event</button>
      </div>

      <hr/>

      <div>
        <select id="playerSelect">
          ${state.players.map(p =>
            `<option value="${p.id}">${p.name}</option>`
          ).join("")}
        </select>

        <input id="actionInput" placeholder="Declare action..." />
        <button id="declareAction">Declare</button>
      </div>

      <hr/>

      <div>
        <button id="moveWorld">Move Location</button>
        <button id="triggerEvent">Trigger Event</button>
      </div>
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  document.getElementById("nextTurn")?.addEventListener("click", () => {
    TurnManager.nextTurn(state);
    onUpdate();
  });

  document.getElementById("phaseExplore")?.addEventListener("click", () => {
    TurnManager.setPhase(state, Phase.EXPLORE);
    onUpdate();
  });

  document.getElementById("phaseCombat")?.addEventListener("click", () => {
    TurnManager.setPhase(state, Phase.COMBAT);
    onUpdate();
  });

  document.getElementById("phaseEvent")?.addEventListener("click", () => {
    TurnManager.setPhase(state, Phase.EVENT);
    onUpdate();
  });

  document.getElementById("declareAction")?.addEventListener("click", () => {
    const playerId = (document.getElementById("playerSelect") as HTMLSelectElement).value;
    const action = (document.getElementById("actionInput") as HTMLInputElement).value;

    if (!action) return;
    declareAction(playerId, action);

    (document.getElementById("actionInput") as HTMLInputElement).value = "";
  });

  document.getElementById("moveWorld")?.addEventListener("click", () => {
    WorldEngine.moveToRandomLocation(state);
    onUpdate();
  });

  document.getElementById("triggerEvent")?.addEventListener("click", () => {
    EventEngine.triggerRandomEvent(state);
    onUpdate();
  });
}
