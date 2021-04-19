import { Component, OnInit } from '@angular/core';
import { Tile } from '../_models/tile';

interface ship {
  name: string,
  holes: number,
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  yourBoard: Tile[];
  yourShips: ship[];
  oppShips: ship[];
  oppBoard: Tile[];

  showChat: Boolean;

  constructor() { }

  initBoard(): void {
    this.yourBoard = [{
      coord: 0,
      hasBoat: false,
      isBombed: false
    }];

    this.oppBoard = [{
      coord: 0,
      hasBoat: false,
      isBombed: false
    }];

    for (let i = 1; i <= 99; i++) {
      this.yourBoard.push({
        coord: i,
        hasBoat: false,
        isBombed: false
      });

      this.oppBoard.push({
        coord: i,
        hasBoat: false,
        isBombed: false
      });
    }
  }

  labelShips(): ship[] {

    let ships = [{
      name: "Courier",
      holes: 5
    }];

    for (let i = 4; i >= 1; i--) {
      ships.push({
        holes: i,
        ...(i === 4 && { name: "Battleship" }),
        ...(i === 3 && { name: "Cruiser" }),
        ...(i === 2 && { name: "Submarine" }),
        ...(i === 1 && { name: "Destroyer" }),
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

}
