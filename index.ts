import { initGame } from "./engine/game_state"

initGame({
  season: "season_1",
  players: 3
})
import { GameState } from "../engine/game_state";
import { render } from "./render";

export function mountUI(state: GameState) {
  render(state);
}
