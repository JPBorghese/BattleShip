import { Component, OnInit } from '@angular/core';

interface tile {
  coord: number;
  hasBoat: boolean;
  isBombed: boolean;
}

@Component({
  selector: 'app-game', 
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  yourBoard: tile[];
  oppBoard: tile[];

  constructor() { }
  
  ngOnInit(): void {
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

  display(tile) {
    console.log(tile.coord);
  }
}
