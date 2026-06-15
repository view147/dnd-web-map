// engine/game_state.ts

export type Phase =
  | "EXPLORATION"
  | "COMBAT"
  | "EVENT"
  | "DOWNTIME"
  | "ENDING";

export interface PlayerState {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  infectionStage: number; // 0–5
  statusEffects: string[];
  inventory: string[];
  traits: string[];
  alive: boolean;
}

export interface WorldState {
  locationId: string;
  time: number; // day counter
  flags: Record<string, boolean>; // world memory
}

export interface TurnState {
  currentTurn: number;
  activePlayerId: string | null;
  phase: Phase;
}

export interface LogEntry {
  time: number;
  source: "SYSTEM" | "GM" | "PLAYER";
  message: string;
}

export interface GameState {
  sessionId: string;
  season: string;

  players: PlayerState[];
  world: WorldState;
  turn: TurnState;

  logs: LogEntry[];

  gmNotes?: string; // invisible to players
}

export const createInitialGameState = (): GameState => ({
  sessionId: crypto.randomUUID(),
  season: "season_1",

  players: [],

  world: {
    locationId: "start_zone",
    time: 0,
    flags: {}
  },

  turn: {
    currentTurn: 1,
    activePlayerId: null,
    phase: "EXPLORATION"
  },

  logs: []
});
