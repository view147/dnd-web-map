// render.ts
import { GameState } from "./engine/game_state";

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

  // --- DEBUG ---
  console.clear();
  console.log("PHASE:", state.phase);
  console.log("TURN:", state.turnState.turn);
  console.log("LOCATION:", state.world.locationId);

  // --- UI ---
  root.innerHTML = `
    <div style="font-family: monospace; padding: 12px; background:#0a0a0a; color:#ccc; min-height:100vh;">
      
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
  const endingBanner = state.ending.triggered
    ? `<div style="background:#600; padding:8px; margin-top:8px;">
        🏁 ENDING: ${state.ending.type} — ${state.ending.description}
       </div>`
    : "";

  return `
    <div style="border-bottom:1px solid #444; padding-bottom:8px;">
      <strong>THE FLOOD</strong>
      &nbsp;|&nbsp;
      <strong>TURN</strong>: ${state.turnState.turn}
      &nbsp;|&nbsp;
      <strong>PHASE</strong>: ${state.phase}
      &nbsp;|&nbsp;
      <strong>DAY</strong>: ${state.world.day} (${state.world.time})
      &nbsp;|&nbsp;
      <strong>WORLD INFECTION</strong>: ${state.world.globalInfectionLevel}
      ${endingBanner}
    </div>
  `;
}

function renderPlayers(state: GameState): string {
  return `
    <div style="width:40%;">
      <h3>PLAYERS</h3>
      ${state.players.map(p => {
        const infected = p.status.infected;
        const stage = p.status.infectionStage;
        const restrained = p.status.restrained;
        const borderColor = !p.alive ? "#600" : infected ? "#960" : "#333";

        return `
          <div style="
            border:1px solid ${borderColor};
            padding:6px;
            margin-bottom:6px;
            opacity:${p.alive ? 1 : 0.5};
          ">
            <strong>${p.name}</strong>
            ${!p.alive ? " <span style='color:#f00'>[DEAD]</span>" : ""}
            <br/>
            Role: ${p.role}<br/>
            HP: ${p.status.hp} / ${p.status.maxHp}<br/>
            Stamina: ${p.status.stamina} / ${p.status.maxStamina}<br/>
            Infected: ${infected ? `<span style="color:#f80">YES (Stage ${stage})</span>` : "No"}<br/>
            Restrained: ${restrained ? "<span style='color:#fa0'>YES</span>" : "No"}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderWorld(state: GameState): string {
  return `
    <div style="width:60%;">
      <h3>WORLD</h3>
      <div style="border:1px solid #333; padding:6px;">
        <strong>Map:</strong> ${state.world.mapId}<br/>
        <strong>Location:</strong> ${state.world.locationId}<br/>
        <strong>Day:</strong> ${state.world.day}<br/>
        <strong>Time:</strong> ${state.world.time}<br/>
        <strong>Global Infection:</strong> ${state.world.globalInfectionLevel}
      </div>
    </div>
  `;
}

function renderLogs(state: GameState): string {
  const logs = state.gmNotes.slice(-20).reverse();

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
      ${logs.length === 0
        ? "<div style='color:#555'>No logs yet.</div>"
        : logs.map(msg => `<div>▸ ${msg}</div>`).join("")
      }
    </div>
  `;
}
