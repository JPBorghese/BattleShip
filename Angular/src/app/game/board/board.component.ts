import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Board } from "../../_models/board";
import { Tile } from "../../_models/tile";
import { Ship } from "../../_models/ship";


@Component({
  selector: 'board-component',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() leftTiles: Tile[];
  @Input() rightTiles: Tile[];
  @Input() leftShips: Ship[];
  @Input() rightShips: Ship[];
  @Output() placeEvent = new EventEmitter<number>();

  constructor() { }

  initTiles(): Tile[] {
    let tiles;
    tiles = [{
      coord: 0,
      ship: undefined,
      isBombed: false
    }];

    for (let i = 1; i <= 99; i++) {
      tiles.push({
        coord: i,
        ship: null,
        isBombed: false
      });
    }

    return tiles;
  }

  private initShips(): Ship[] {
    let ships = [{
      name: "Courier",
      holes: 5,
      pos: [],
    }];

    for (let i = 4; i >= 1; i--) {
      ships.push({
        holes: i,
        pos: [],
        ...(i === 4 && { name: "Battleship" }),
        ...(i === 3 && { name: "Cruiser" }),
        ...(i === 2 && { name: "Submarine" }),
        ...(i === 1 && { name: "Destroyer" }),
      });
    }

    //Update board vars
    // for (let ship of ships) {
    //   for (let pos of ship.pos) {
    //     this.tiles[pos].ship = ship;
    //   }
    // }
    return ships;
  }

  shipColor(ship: Ship): String {
    if (ship) {
      if (ship.name === "Courier") {
        return "green";
      } else if (ship.name === "Destroyer") {
        return "yellow";
      } else if (ship.name === "Battleship") {
        return "black";
      } else if (ship.name === "Cruiser") {
        return "orange";
      } else if (ship.name === "Submarine") {
        return "red";
      }
    }
    return "lightblue";
  }

  place(coord: number) {
    this.placeEvent.emit(coord);
  }

  ngOnInit(): void {
    this.leftTiles = this.initTiles();
    this.rightTiles = this.initTiles();
    this.leftShips = this.initShips();
    this.rightShips = this.initShips();
  }
}
