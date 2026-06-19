/* ============================================================
   Game State
   ------------------------------------------------------------
   - ศูนย์กลางข้อมูลของเกมทั้งหมด
   - Engine ทุกตัวอ่าน/เขียนผ่าน state นี้
   - ไม่มี logic การตัดสินใจ (GM เป็นคนตัดสิน)
   ============================================================ */

export type GamePhase =
  | "INIT"
  | "EXPLORATION"
  | "EVENT"
  | "COMBAT"
  | "REST"
  | "ENDING"
  | "PAUSED";

export type TurnOwner = "PLAYER" | "ENEMY" | "WORLD";

export interface PlayerStatus {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;

  infected: boolean;
  infectionStage: number; // 0 = ปกติ, ยิ่งสูงยิ่งรุนแรง
  restrained: boolean; // ถูกมัด / จำกัดการแพร่เชื้อ
}

export interface PlayerState {
  id: string;
  name: string;
  role: string;

  alive: boolean;
  status: PlayerStatus;

  inventory: string[];
  flags: Record<string, boolean>; // GM ใช้จดสถานะเฉพาะ
}

export interface WorldState {
  mapId: string;
  locationId: string;

  day: number;
  time: "MORNING" | "AFTERNOON" | "NIGHT";

  globalInfectionLevel: number; // ระดับการล่มสลายของโลก
  flags: Record<string, boolean>;
}

export interface TurnState {
  turn: number;
  owner: TurnOwner;
  activePlayerId?: string;

  phase: GamePhase;
}

export interface EndingState {
  triggered: boolean;
  type?: "ERADICATION" | "ESCAPE" | "EXTINCTION";
  description?: string;
}

/* ============================================================
   Root Game State
   ============================================================ */

export interface GameState {
  // meta
  gameId: string;
  seasonId: string;
  createdAt: number;

  // core
  phase: GamePhase;
  turnState: TurnState;

  // entities
  players: PlayerState[];
  world: WorldState;

  // ending
  ending: EndingState;

  // GM notes (ไม่กระทบระบบ)
  gmNotes: string[];
}

/* ============================================================
   Factory / Initializer
   ============================================================ */

export function createInitialGameState(
  gameId: string,
  seasonId: string,
  players: Array<{ id: string; name: string; role: string }>,
  startMapId: string,
  startLocationId: string
): GameState {
  return {
    gameId,
    seasonId,
    createdAt: Date.now(),

    phase: "INIT",

    turnState: {
      turn: 1,
      owner: "PLAYER",
      phase: "INIT",
    },

    players: players.map((p) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      alive: true,
      status: {
        hp: 100,
        maxHp: 100,
        stamina: 100,
        maxStamina: 100,
        infected: false,
        infectionStage: 0,
        restrained: false,
      },
      inventory: [],
      flags: {},
    })),

    world: {
      mapId: startMapId,
      locationId: startLocationId,
      day: 1,
      time: "MORNING",
      globalInfectionLevel: 0,
      flags: {},
    },

    ending: {
      triggered: false,
    },

    gmNotes: [],
  };
}

/* ============================================================
   Read Helpers (Safe Access)
   ============================================================ */

export function getPlayerById(
  state: GameState,
  playerId: string
): PlayerState | undefined {
  return state.players.find((p) => p.id === playerId);
}

export function getAlivePlayers(state: GameState): PlayerState[] {
  return state.players.filter((p) => p.alive);
}

/* ============================================================
   Mutators (NO DECISION MAKING)
   ------------------------------------------------------------
   - Engine อื่นเรียกใช้
   - GM เป็นคนตัดสินว่าจะเรียกหรือไม่
   ============================================================ */

export function setGamePhase(state: GameState, phase: GamePhase) {
  state.phase = phase;
  state.turnState.phase = phase;
}

export function advanceTurn(state: GameState) {
  state.turnState.turn += 1;
}

export function setTurnOwner(state: GameState, owner: TurnOwner) {
  state.turnState.owner = owner;
}

export function setActivePlayer(
  state: GameState,
  playerId: string | undefined
) {
  state.turnState.activePlayerId = playerId;
}

export function addGMNote(state: GameState, note: string) {
  state.gmNotes.push(note);
}

/* ============================================================
   Ending Control (GM Trigger Only)
   ============================================================ */

export function triggerEnding(
  state: GameState,
  type: EndingState["type"],
  description: string
) {
  state.ending = {
    triggered: true,
    type,
    description,
  };
  state.phase = "ENDING";
}
