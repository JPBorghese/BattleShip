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
  @Input() board: Board;
  
  tiles: Tile[]
  ships: Ship[]
  constructor() { }

  initTiles() {
    this.tiles = [{
      coord: 0,
      ship: undefined,
      isBombed: false
    }];

    for (let i = 1; i <= 99; i++) {
      this.tiles.push({
        coord: i,
        ship: null,
        isBombed: false
      });
    }
  }

  labelShips(): Ship[] {

    let ships = [{
      name: "Courier",
      holes: 5,
      pos: [0, 1, 2, 3, 4]
    }];

    for (let i = 4; i >= 1; i--) {
      ships.push({
        holes: i,
        ...(i === 4 && { name: "Battleship" }),
        ...(i === 3 && { name: "Cruiser" }),
        ...(i === 2 && { name: "Submarine" }),
        ...(i === 1 && { name: "Destroyer" }),
        ...(i === 4 && { pos: [10, 11, 12, 13] }),
        ...(i === 3 && { pos: [20, 21, 22] }),
        ...(i === 2 && { pos: [30, 31] }),
        ...(i === 1 && { pos: [31] }),
      });
    }
    return ships;
  }

  initShips(): void {
    this.ships = this.labelShips();

    //Update board vars
    
  }

  // shipColor(tile: Tile): String {
  //   for (let ship of this.ships) {
  //     for (let i = 0; i < ship.pos.length; i++) {
  //       if (this.tiles.includes(ship.pos[i]))
  //     }
  //   }
  // }


  ngOnInit(): void {
    this.initTiles();
    this.initShips();
  }
}
