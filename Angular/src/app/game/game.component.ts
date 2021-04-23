import { Component, OnInit } from '@angular/core';
import { Tile } from '../_models/tile';
import { Ship } from '../_models/ship';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  width = 10;
  height = 10;
  yourBoard: Tile[];
  oppBoard: Tile[];
  yourShips: Ship[];
  oppShips: Ship[];
  showChat: Boolean;

  constructor() { }


  initBoard(): void {

    this.yourBoard = [{
      coord: 0,
      ship: undefined,
      isBombed: false
    }];

    this.oppBoard = [{
      coord: 0,
      ship: undefined,
      isBombed: false
    }];

    for (let i = 1; i <= 99; i++) {
      this.yourBoard.push({
        coord: i,
        ship: null,
        isBombed: false
      });

      this.oppBoard.push({
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

    this.yourShips = this.labelShips();
    this.oppShips = this.labelShips();
  }

  ngOnInit(): void {
    this.showChat = false;
    this.initBoard();
    this.initShips();
  }

  updateShipCoord() {

  }

  test(event) {
    console.log(event);
    return;
  }
}
