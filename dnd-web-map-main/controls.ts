// controls.ts
import { GameState, setGamePhase } from "./engine/game_state";
import { TurnManager } from "./engine/turn_manager";
import { CombatAction } from "./engine/combat_engine";
import { GameEvent } from "./engine/event_engine";

/* =========================
   Types
   ========================= */

export interface ControlsConfig {
  onPlayerAction: (action: CombatAction) => void;
  onEndTurn: () => void;
}

/* =========================
   Bind (called from index.ts)
   ========================= */

export function bindControls(config: ControlsConfig) {
  // Next Turn button
  document.getElementById("btn-end-turn")?.addEventListener("click", () => {
    config.onEndTurn();
  });

  // Attack button
  document.getElementById("btn-attack")?.addEventListener("click", () => {
    const sourceId = (document.getElementById("select-source") as HTMLSelectElement)?.value;
    const targetId = (document.getElementById("select-target") as HTMLSelectElement)?.value;
    const value = parseInt((document.getElementById("input-damage") as HTMLInputElement)?.value ?? "10");

    if (!sourceId || !targetId) return;

    config.onPlayerAction({
      type: "ATTACK",
      sourceId,
      targetId,
      value,
    });
  });

  // Flee button
  document.getElementById("btn-flee")?.addEventListener("click", () => {
    const sourceId = (document.getElementById("select-source") as HTMLSelectElement)?.value;
    if (!sourceId) return;

    config.onPlayerAction({
      type: "FLEE",
      sourceId,
    });
  });

  // Defend button
  document.getElementById("btn-defend")?.addEventListener("click", () => {
    const sourceId = (document.getElementById("select-source") as HTMLSelectElement)?.value;
    if (!sourceId) return;

    config.onPlayerAction({
      type: "DEFEND",
      sourceId,
    });
  });
}
