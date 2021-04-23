import { Ship } from "./ship";
import { Tile } from "./tile";

export class Board {
    gameId: String;
    tiles: Tile[];
    ships: Ship[];
}