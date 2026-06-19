// ============================================================
// Ending Engine
// ------------------------------------------------------------
// - ตรวจสอบเงื่อนไขจบเกม
// - ไม่ตัดสินใจแทน GM
// - GM เป็นคนกด trigger จริง
// ============================================================

import { GameState, getAlivePlayers } from "./game_state";

export type EndingType = "ERADICATION" | "ESCAPE" | "EXTINCTION";

export interface EndingCheckResult {
  type: EndingType;
  description: string;
}

export class EndingEngine {
  /* ---------------------------------------------------------
     Check Ending Conditions
     (GM ใช้ตรวจสอบ — ไม่ได้ trigger เอง)
     --------------------------------------------------------- */

  static checkEnding(state: GameState): EndingCheckResult | null {
    // ผู้เล่นทุกคนตายหมด
    const alive = getAlivePlayers(state);
    if (alive.length === 0) {
      return {
        type: "EXTINCTION",
        description: "ผู้รอดชีวิตทุกคนสูญเสียชีวิต โลกพ่ายแพ้ต่อ The Flood",
      };
    }

    // โลกติดเชื้อเต็มขั้น
    if (state.world.globalInfectionLevel >= 100) {
      return {
        type: "EXTINCTION",
        description: "The Flood แพร่กระจายเต็มโลก ไม่เหลือพื้นที่ปลอดภัย",
      };
    }

    // ผู้เล่นกำจัดเชื้อได้
    if (state.world.flags["flood_eradicated"]) {
      return {
        type: "ERADICATION",
        description:
          "The Flood ถูกกำจัด — แต่แลกมาด้วยราคาที่โลกต้องจ่าย",
      };
    }

    // ผู้เล่นขึ้นยานหนีได้
    if (state.world.flags["escape_ship_launched"]) {
      return {
        type: "ESCAPE",
        description:
          "ยานอพยพออกเดินทางแล้ว — บางคนรอด บางคนไม่ได้ไป",
      };
    }

    return null; // ยังไม่ถึงจุดจบ
  }

  /* ---------------------------------------------------------
     Helpers (GM ใช้ set flag ก่อน trigger)
     --------------------------------------------------------- */

  static markFloodEradicated(state: GameState) {
    state.world.flags["flood_eradicated"] = true;
  }

  static markShipLaunched(state: GameState) {
    state.world.flags["escape_ship_launched"] = true;
  }
}
