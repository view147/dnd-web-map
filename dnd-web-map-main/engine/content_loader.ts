// ============================================================
// Content Loader
// ------------------------------------------------------------
// - โหลดข้อมูล season เข้า GameState
// - แยก Content (JSON) ออกจาก Runtime (GameState)
// - GM เรียกใช้ตอนเริ่มเกม
// ============================================================

import { GameState, PlayerState, addGMNote } from "./game_state";

/* ============================================================
   Types (ตรงกับ JSON จริง)
   ============================================================ */

export interface SeasonStory {
  title: string;
  intro: string;
  milestones: Array<{ day: number; event: string }>;
  ending: string;
}

export interface MapData {
  id: string;
  threatLevel: number;
  infectionRisk: number;
  lootTable: string;
  connections: string[];
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  scope: "PLAYER" | "PARTY" | "WORLD";
  conditions?: {
    dayMin?: number;
    map?: string;
  };
  choices: Array<{
    id: string;
    description: string;
    effects: any[];
  }>;
}

export interface CharacterTemplate {
  name: string;
  role: string;
  startingCondition: string[];
  storyTag: string;
}

export interface SeasonContent {
  story: SeasonStory;
  maps: Record<string, MapData>;
  events: Record<string, EventData>;
  characters: Record<string, CharacterTemplate>;
}

/* ============================================================
   Loader
   ============================================================ */

export class ContentLoader {
  private static cache: Record<string, SeasonContent> = {};

  /* ---------------------------------------------------------
     Load Season (เรียกตอนเริ่มเกม)
     --------------------------------------------------------- */

  static async loadSeason(seasonId: string): Promise<SeasonContent> {
    if (this.cache[seasonId]) return this.cache[seasonId];

    const base = `./content/${seasonId}`;

    const [story, maps, events, characters] = await Promise.all([
      this.fetchJSON<SeasonStory>(`${base}/story.json`),
      this.loadMaps(base),
      this.loadEvents(base),
      this.loadCharacters(base),
    ]);

    const content: SeasonContent = { story, maps, events, characters };
    this.cache[seasonId] = content;
    return content;
  }

  /* ---------------------------------------------------------
     Apply Season to GameState
     --------------------------------------------------------- */

  static applySeasonToState(
    state: GameState,
    content: SeasonContent
  ): void {
    // ตั้ง starting location จาก map แรก
    const firstMapId = Object.keys(content.maps)[0];
    if (firstMapId) {
      state.world.mapId = firstMapId;
      state.world.locationId = content.maps[firstMapId].connections[0] ?? firstMapId;
    }

    // จด intro ลง GM notes
    addGMNote(state, `📖 ${content.story.title}: ${content.story.intro}`);

    // จด milestones
    for (const m of content.story.milestones) {
      addGMNote(state, `📌 Milestone Day ${m.day}: ${m.event}`);
    }
  }

  /* ---------------------------------------------------------
     Get Event (GM ใช้ตอนจะ trigger event)
     --------------------------------------------------------- */

  static getEvent(
    content: SeasonContent,
    eventId: string
  ): EventData | null {
    return content.events[eventId] ?? null;
  }

  /* ---------------------------------------------------------
     Get Available Events (กรองตาม conditions)
     --------------------------------------------------------- */

  static getAvailableEvents(
    state: GameState,
    content: SeasonContent
  ): EventData[] {
    return Object.values(content.events).filter((event) => {
      const c = event.conditions;
      if (!c) return true;
      if (c.dayMin !== undefined && state.world.day < c.dayMin) return false;
      if (c.map && state.world.mapId !== c.map) return false;
      return true;
    });
  }

  /* ---------------------------------------------------------
     Build Player from Character Template
     --------------------------------------------------------- */

  static buildPlayer(
    template: CharacterTemplate,
    overrides: { id: string; name?: string }
  ): Omit<PlayerState, "inventory" | "flags"> & {
    inventory: string[];
    flags: Record<string, boolean>;
  } {
    return {
      id: overrides.id,
      name: overrides.name ?? template.name,
      role: template.role,
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
    };
  }

  /* ---------------------------------------------------------
     Internal Fetchers
     --------------------------------------------------------- */

  private static async loadMaps(base: string): Promise<Record<string, MapData>> {
    const mapIds = ["abandoned_city", "highway", "research_lab"];
    const maps: Record<string, MapData> = {};

    await Promise.allSettled(
      mapIds.map(async (id) => {
        try {
          maps[id] = await this.fetchJSON<MapData>(`${base}/maps/${id}.json`);
        } catch {
          // ไม่มีไฟล์นี้ก็ข้ามไป
        }
      })
    );

    return maps;
  }

  private static async loadEvents(base: string): Promise<Record<string, EventData>> {
    const eventIds = ["infected_survivor", "moral_choice_01", "broken_radio"];
    const events: Record<string, EventData> = {};

    await Promise.allSettled(
      eventIds.map(async (id) => {
        try {
          events[id] = await this.fetchJSON<EventData>(`${base}/events/${id}.json`);
        } catch {
          // ไม่มีไฟล์นี้ก็ข้ามไป
        }
      })
    );

    return events;
  }

  private static async loadCharacters(
    base: string
  ): Promise<Record<string, CharacterTemplate>> {
    const charIds = ["medic_lin", "soldier_kael", "engineer_echo"];
    const characters: Record<string, CharacterTemplate> = {};

    await Promise.allSettled(
      charIds.map(async (id) => {
        try {
          characters[id] = await this.fetchJSON<CharacterTemplate>(
            `${base}/characters/${id}.json`
          );
        } catch {
          // ไม่มีไฟล์นี้ก็ข้ามไป
        }
      })
    );

    return characters;
  }

  private static async fetchJSON<T>(path: string): Promise<T> {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load: ${path}`);
    return res.json() as Promise<T>;
  }
}
