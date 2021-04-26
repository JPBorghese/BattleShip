import { Ship } from "./ship";
import { Tile } from "./tile";
import { GameState } from "./gamestate";

export class Board {
    username: String;
    state: GameState;
    tiles: Tile[];
    ships: Ship[];
}