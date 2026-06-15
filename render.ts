import { GameState } from "../engine/game_state";

export function render(state: GameState) {
  console.clear();
  console.log("PHASE:", state.turn.phase);
  console.log("TURN:", state.turn.currentTurn);

  state.players.forEach(p => {
    console.log(
      `${p.name} | HP ${p.hp}/${p.maxHp} | INF ${p.infectionStage}`
    );
  });

  console.log("LOCATION:", state.world.locationId);
}
