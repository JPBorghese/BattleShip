import { Ship } from "./ship";
import { Tile } from "./tile";
import { GameState } from "./gamestate";

export class Board {
    user: String;
    state: GameState;
    tiles: Tile[];
    ships: Ship[];
}