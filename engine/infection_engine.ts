// ============================================================
// Infection Engine – The Flood
// ------------------------------------------------------------
// - จัดการสถานะการติดเชื้อ
// - ไม่มีการตัดสินใจแทน GM
// - ไม่มีการสุ่ม
// - ไม่มีการเดินเวลาเอง
// ============================================================

import { GameState, PlayerState } from "./game_state";

export type InfectionEffect = {
  hpPenalty?: number;
  staminaPenalty?: number;
  description: string;
};

export class InfectionEngine {
  /* ---------------------------------------------------------
     Core Queries
     --------------------------------------------------------- */

  static isInfected(player: PlayerState): boolean {
    return player.status.infected;
  }

  static getInfectionStage(player: PlayerState): number {
    return player.status.infectionStage;
  }

  /* ---------------------------------------------------------
     Infection Control (GM-triggered)
     --------------------------------------------------------- */

  static infectPlayer(
    state: GameState,
    playerId: string,
    initialStage: number = 1
  ) {
    const player = this.getPlayer(state, playerId);
    if (!player || !player.alive) return;

    player.status.infected = true;
    player.status.infectionStage = initialStage;
  }

  static curePlayer(state: GameState, playerId: string) {
    const player = this.getPlayer(state, playerId);
    if (!player) return;

    player.status.infected = false;
    player.status.infectionStage = 0;
    player.status.restrained = false;
  }

  static restrainInfection(state: GameState, playerId: string) {
    const player = this.getPlayer(state, playerId);
    if (!player || !player.status.infected) return;

    player.status.restrained = true;
  }

  static releaseRestraint(state: GameState, playerId: string) {
    const player = this.getPlayer(state, playerId);
    if (!player) return;

    player.status.restrained = false;
  }

  /* ---------------------------------------------------------
     Progression (MANUAL ONLY)
     --------------------------------------------------------- */

  static increaseStage(state: GameState, playerId: string, amount = 1) {
    const player = this.getPlayer(state, playerId);
    if (!player || !player.status.infected) return;

    player.status.infectionStage += amount;
  }

  static decreaseStage(state: GameState, playerId: string, amount = 1) {
    const player = this.getPlayer(state, playerId);
    if (!player || !player.status.infected) return;

    player.status.infectionStage = Math.max(
      0,
      player.status.infectionStage - amount
    );

    if (player.status.infectionStage === 0) {
      player.status.infected = false;
    }
  }

  /* ---------------------------------------------------------
     Gameplay Effects (READ ONLY)
     --------------------------------------------------------- */

  static getStageEffect(player: PlayerState): InfectionEffect | null {
    if (!player.status.infected) return null;

    const stage = player.status.infectionStage;

    // ตัวเลขพวกนี้ “ตั้งใจให้ GM ปรับเองได้ง่าย”
    if (stage === 1) {
      return {
        staminaPenalty: 10,
        description: "เริ่มมีอาการอ่อนล้า เหนื่อยง่าย",
      };
    }

    if (stage === 2) {
      return {
        staminaPenalty: 25,
        hpPenalty: 10,
        description: "ระบบร่างกายเริ่มถูกรบกวน การฟื้นตัวช้าลง",
      };
    }

    if (stage === 3) {
      return {
        staminaPenalty: 40,
        hpPenalty: 25,
        description: "การติดเชื้อรุนแรง สมรรถภาพตกอย่างเห็นได้ชัด",
      };
    }

    if (stage >= 4) {
      return {
        staminaPenalty: 60,
        hpPenalty: 50,
        description:
          "เชื้อ The Flood ควบคุมร่างกายบางส่วน พฤติกรรมเริ่มผิดปกติ",
      };
    }

    return null;
  }

  /* ---------------------------------------------------------
     World Interaction (OPTIONAL)
     --------------------------------------------------------- */

  static increaseGlobalInfection(state: GameState, amount = 1) {
    state.world.globalInfectionLevel += amount;
  }

  /* ---------------------------------------------------------
     Internal Helper
     --------------------------------------------------------- */

  private static getPlayer(
    state: GameState,
    playerId: string
  ): PlayerState | undefined {
    return state.players.find((p) => p.id === playerId);
  }
}
