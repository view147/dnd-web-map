// render.ts
import { GameState } from "../engine/game_state";

let root: HTMLElement | null = null;

/**
 * เรียกครั้งเดียวจาก index.ts
 */
export function initRender(rootId: string = "app") {
  root = document.getElementById(rootId);
  if (!root) throw new Error("Render root not found");
}

/**
 * วาดหน้าจอทุกครั้งที่ state เปลี่ยน
 */
export function render(state: GameState) {
  if (!root) throw new Error("Render not initialized");

  // --- DEBUG (ยังเก็บไว้ได้) ---
  console.clear();
  console.log("PHASE:", state.turn.phase);
  console.log("TURN:", state.turn.currentTurn);
  console.log("LOCATION:", state.world.locationId);

  // --- UI ---
  root.innerHTML = `
    <div style="font-family: monospace; padding: 12px;">
      
      ${renderHeader(state)}

      <div style="display:flex; gap:16px; margin-top:12px;">
        ${renderPlayers(state)}
        ${renderWorld(state)}
      </div>

      <div style="margin-top:12px;">
        ${renderLogs(state)}
      </div>

    </div>
  `;
}

/* ===================== SUB UI ===================== */

function renderHeader(state: GameState): string {
  return `
    <div style="border-bottom:1px solid #444; padding-bottom:8px;">
      <strong>TURN</strong>: ${state.turn.currentTurn}
      &nbsp;|&nbsp;
      <strong>PHASE</strong>: ${state.turn.phase}
    </div>
  `;
}

function renderPlayers(state: GameState): string {
  return `
    <div style="width:40%;">
      <h3>PLAYERS</h3>
      ${state.players.map(p => `
        <div style="
          border:1px solid #333;
          padding:6px;
          margin-bottom:6px;
        ">
          <strong>${p.name}</strong><br/>
          HP: ${p.hp}/${p.maxHp}<br/>
          Infection: ${p.infectionStage}<br/>
          Status: ${p.status.join(", ") || "Normal"}
        </div>
      `).join("")}
    </div>
  `;
}

function renderWorld(state: GameState): string {
  return `
    <div style="width:60%;">
      <h3>WORLD</h3>
      <div style="border:1px solid #333; padding:6px;">
        <strong>Location:</strong> ${state.world.locationId}<br/>
        <strong>Danger Level:</strong> ${state.world.dangerLevel}<br/>
        <strong>Time:</strong> ${state.world.time}
      </div>
    </div>
  `;
}

function renderLogs(state: GameState): string {
  return `
    <h3>LOGS</h3>
    <div style="
      max-height:200px;
      overflow-y:auto;
      border:1px solid #333;
      padding:6px;
      background:#111;
      color:#0f0;
    ">
      ${state.logs.slice(-20).map(log => `
        <div>
          [${new Date(log.time).toLocaleTimeString()}]
          <strong>${log.source}</strong>:
          ${log.message}
        </div>
      `).join("")}
    </div>
  `;
}
