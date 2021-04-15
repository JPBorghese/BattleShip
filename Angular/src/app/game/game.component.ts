import { Component, OnInit } from '@angular/core';
import {Tile} from '../_models/tile';

@Component({
  selector: 'app-game', 
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  yourBoard: Tile[];
  oppBoard: Tile[];

  constructor() { }
  
  ngOnInit(): void {
    this.yourBoard = [{
      coord: 0,
      hasBoat: false,
      isBombed: false
    }];

    console.log(typeof(this.yourBoard[0]));
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

  display(tile) {
    console.log(tile.coord);
  }
}
