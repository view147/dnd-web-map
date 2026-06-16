// ============================================================
// World Engine
// ------------------------------------------------------------
// - จัดการโลก / location / เวลา
// - ไม่มีการตัดสินใจแทน GM
// - ไม่มีการสุ่ม
// ============================================================

import { GameState } from "./game_state";

export class WorldEngine {
  /* ---------------------------------------------------------
     Location
     --------------------------------------------------------- */

  static moveToLocation(
    state: GameState,
    mapId: string,
    locationId: string
  ) {
    state.world.mapId = mapId;
    state.world.locationId = locationId;
  }

  /* ---------------------------------------------------------
     World Infection
     --------------------------------------------------------- */

  static increaseGlobalInfection(state: GameState, amount = 1) {
    state.world.globalInfectionLevel += amount;
  }

  static decreaseGlobalInfection(state: GameState, amount = 1) {
    state.world.globalInfectionLevel = Math.max(
      0,
      state.world.globalInfectionLevel - amount
    );
  }

  /* ---------------------------------------------------------
     Flags (GM-controlled)
     --------------------------------------------------------- */

  static setFlag(state: GameState, key: string, value: boolean) {
    state.world.flags[key] = value;
  }

  static getFlag(state: GameState, key: string): boolean {
    return state.world.flags[key] ?? false;
  }

  /* ---------------------------------------------------------
     Queries
     --------------------------------------------------------- */

  static isLocationVisited(state: GameState, locationId: string): boolean {
    return state.world.flags[`visited_${locationId}`] ?? false;
  }

  static markLocationVisited(state: GameState, locationId: string) {
    state.world.flags[`visited_${locationId}`] = true;
  }
}
