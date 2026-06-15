// engine/world_engine.ts

import { EventEngine } from "./event_engine"
import { CombatEngine } from "./combat_engine"

/* ================================
   Types
================================ */

export type Position = {
  x: number
  y: number
  zone: string
}

export type WorldEntity = {
  id: string
  type: "npc" | "monster" | "object"
  position: Position
  data?: any
}

export type WorldState = {
  playerPosition: Position
  entities: WorldEntity[]
  discoveredZones: string[]
}

/* ================================
   World Engine
================================ */

export class WorldEngine {
  private state: WorldState
  private eventEngine: EventEngine
  private combatEngine: CombatEngine

  constructor(
    initialState: WorldState,
    eventEngine: EventEngine,
    combatEngine: CombatEngine
  ) {
    this.state = initialState
    this.eventEngine = eventEngine
    this.combatEngine = combatEngine
  }

  /* ================================
     Getters
  ================================ */

  getState(): WorldState {
    return structuredClone(this.state)
  }

  getPlayerPosition(): Position {
    return { ...this.state.playerPosition }
  }

  /* ================================
     Movement
  ================================ */

  movePlayer(dx: number, dy: number) {
    const pos = this.state.playerPosition

    const newPos: Position = {
      ...pos,
      x: pos.x + dx,
      y: pos.y + dy,
    }

    this.state.playerPosition = newPos

    this.checkWorldInteraction()
  }

  teleport(position: Position) {
    this.state.playerPosition = position
    this.checkWorldInteraction()
  }

  /* ================================
     World Interaction
  ================================ */

  private checkWorldInteraction() {
    const playerPos = this.state.playerPosition

    const entitiesHere = this.state.entities.filter(e =>
      e.position.zone === playerPos.zone &&
      e.position.x === playerPos.x &&
      e.position.y === playerPos.y
    )

    for (const entity of entitiesHere) {
      this.handleEntityInteraction(entity)
    }
  }

  private handleEntityInteraction(entity: WorldEntity) {
    switch (entity.type) {
      case "monster":
        this.combatEngine.startCombat(entity)
        break

      case "npc":
        this.eventEngine.triggerEvent("talk", {
          npcId: entity.id
        })
        break

      case "object":
        this.eventEngine.triggerEvent("inspect", {
          objectId: entity.id
        })
        break
    }
  }

  /* ================================
     World Management
  ================================ */

  addEntity(entity: WorldEntity) {
    this.state.entities.push(entity)
  }

  removeEntity(entityId: string) {
    this.state.entities = this.state.entities.filter(e => e.id !== entityId)
  }
}
