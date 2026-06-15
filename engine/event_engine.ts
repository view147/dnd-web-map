// ============================================================
// Event Engine
// ------------------------------------------------------------
// - ระบบเหตุการณ์ (Moral / Survival / World)
// - GM เป็นผู้เลือก event และผลลัพธ์
// - Engine ทำหน้าที่ apply consequence เท่านั้น
// ============================================================

import { GameState, PlayerState } from "./game_state";
import { InfectionEngine } from "./infection_engine";

/* ============================================================
   Event Types
   ============================================================ */

export type EventScope = "PLAYER" | "PARTY" | "WORLD";

export interface GameEvent {
  id: string;
  title: string;
  description: string;

  scope: EventScope;
  targetPlayerId?: string;

  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  description: string;

  // ผลลัพธ์ไม่ถูกตัดสินโดย engine
  // GM เลือกแล้วค่อย apply
  effects: EventEffect[];
}

export type EventEffect =
  | {
      type: "DAMAGE";
      targetPlayerId: string;
      value: number;
    }
  | {
      type: "HEAL";
      targetPlayerId: string;
      value: number;
    }
  | {
      type: "INFECT";
      targetPlayerId: string;
      stage?: number;
    }
  | {
      type: "INFECTION_STAGE_UP";
      targetPlayerId: string;
      value?: number;
    }
  | {
      type: "KILL";
      targetPlayerId: string;
    }
  | {
      type: "SET_FLAG";
      scope: EventScope;
      key: string;
      value: boolean;
    }
  | {
      type: "WORLD_INFECTION";
      value: number;
    }
  | {
      type: "NOTE";
      message: string;
    };

/* ============================================================
   Event Engine
   ============================================================ */

export class EventEngine {
  /* ---------------------------------------------------------
     Apply Event Choice (GM Triggered)
     --------------------------------------------------------- */

  static applyChoice(
    state: GameState,
    event: GameEvent,
    choiceId: string
  ): void {
    const choice = event.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    for (const effect of choice.effects) {
      this.applyEffect(state, effect);
    }
  }

  /* ---------------------------------------------------------
     Effect Resolver (NO LOGIC / NO RNG)
     --------------------------------------------------------- */

  private static applyEffect(
    state: GameState,
    effect: EventEffect
  ): void {
    switch (effect.type) {
      case "DAMAGE": {
        const player = this.getPlayer(state, effect.targetPlayerId);
        if (!player || !player.alive) break;

        player.status.hp -= effect.value;
        if (player.status.hp <= 0) {
          player.status.hp = 0;
          player.alive = false;
        }
        break;
      }

      case "HEAL": {
        const player = this.getPlayer(state, effect.targetPlayerId);
        if (!player || !player.alive) break;

        player.status.hp = Math.min(
          player.status.maxHp,
          player.status.hp + effect.value
        );
        break;
      }

      case "INFECT": {
        InfectionEngine.infectPlayer(
          state,
          effect.targetPlayerId,
          effect.stage ?? 1
        );
        break;
      }

      case "INFECTION_STAGE_UP": {
        InfectionEngine.increaseStage(
          state,
          effect.targetPlayerId,
          effect.value ?? 1
        );
        break;
      }

      case "KILL": {
        const player = this.getPlayer(state, effect.targetPlayerId);
        if (!player) break;

        player.alive = false;
        player.status.hp = 0;
        break;
      }

      case "SET_FLAG": {
        if (effect.scope === "WORLD") {
          state.world.flags[effect.key] = effect.value;
        } else if (effect.scope === "PARTY") {
          state.players.forEach(
            (p) => (p.flags[effect.key] = effect.value)
          );
        }
        break;
      }

      case "WORLD_INFECTION": {
        state.world.globalInfectionLevel += effect.value;
        break;
      }

      case "NOTE": {
        state.gmNotes.push(effect.message);
        break;
      }
    }
  }

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */

  private static getPlayer(
    state: GameState,
    playerId: string
  ): PlayerState | undefined {
    return state.players.find((p) => p.id === playerId);
  }
}
