// ============================================================
// Combat Engine
// ------------------------------------------------------------
// - จัดการการต่อสู้แบบ Turn-based
// - ไม่มีการสุ่ม
// - ไม่มี AI
// - ไม่มีการตัดสินผลแทน GM
// ============================================================

import { GameState, PlayerState } from "./game_state";
import { InfectionEngine } from "./infection_engine";

export type CombatActionType =
  | "ATTACK"
  | "DEFEND"
  | "SKILL"
  | "ITEM"
  | "FLEE";

export interface CombatAction {
  type: CombatActionType;
  sourceId: string;
  targetId?: string;
  value?: number; // damage / heal / effect strength
  description?: string;
}

export interface CombatResult {
  success: boolean;
  message: string;
}

/* ============================================================
   Combat Engine
   ============================================================ */

export class CombatEngine {
  /* ---------------------------------------------------------
     Core Validation
     --------------------------------------------------------- */

  static canAct(state: GameState, playerId: string): boolean {
    const player = this.getPlayer(state, playerId);
    if (!player) return false;
    if (!player.alive) return false;

    return true;
  }

  /* ---------------------------------------------------------
     Action Resolver (GM calls this)
     --------------------------------------------------------- */

  static resolveAction(
    state: GameState,
    action: CombatAction
  ): CombatResult {
    const source = this.getPlayer(state, action.sourceId);
    if (!source || !source.alive) {
      return {
        success: false,
        message: "ผู้กระทำไม่สามารถกระทำการได้",
      };
    }

    switch (action.type) {
      case "ATTACK":
        return this.resolveAttack(state, action);

      case "DEFEND":
        return {
          success: true,
          message: `${source.name} ตั้งท่าป้องกัน`,
        };

      case "SKILL":
        return {
          success: true,
          message: `${source.name} ใช้สกิล`,
        };

      case "ITEM":
        return {
          success: true,
          message: `${source.name} ใช้ไอเทม`,
        };

      case "FLEE":
        return {
          success: true,
          message: `${source.name} พยายามหลบหนี`,
        };

      default:
        return {
          success: false,
          message: "การกระทำไม่ถูกต้อง",
        };
    }
  }

  /* ---------------------------------------------------------
     Attack Logic (NO RNG)
     --------------------------------------------------------- */

  private static resolveAttack(
    state: GameState,
    action: CombatAction
  ): CombatResult {
    if (!action.targetId || action.value === undefined) {
      return {
        success: false,
        message: "การโจมตีไม่สมบูรณ์",
      };
    }

    const source = this.getPlayer(state, action.sourceId);
    const target = this.getPlayer(state, action.targetId);

    if (!source || !target || !target.alive) {
      return {
        success: false,
        message: "เป้าหมายไม่ถูกต้อง",
      };
    }

    let damage = action.value;

    // ผลจากการติดเชื้อ (อ่านอย่างเดียว)
    const infectionEffect = InfectionEngine.getStageEffect(source);
    if (infectionEffect?.staminaPenalty) {
      damage = Math.max(0, damage - 5);
    }

    target.status.hp -= damage;

    if (target.status.hp <= 0) {
      target.status.hp = 0;
      target.alive = false;
    }

    return {
      success: true,
      message: `${source.name} โจมตี ${target.name} สร้างความเสียหาย ${damage}`,
    };
  }

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */

  static isCombatOver(state: GameState): boolean {
    const alivePlayers = state.players.filter((p) => p.alive);
    return alivePlayers.length <= 1;
  }

  private static getPlayer(
    state: GameState,
    playerId: string
  ): PlayerState | undefined {
    return state.players.find((p) => p.id === playerId);
  }
}
