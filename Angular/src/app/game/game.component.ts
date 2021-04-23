import { Component, OnInit } from '@angular/core';
import { Ship } from '../_models/ship';
import { Board } from '../_models/board';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  width = 10;
  height = 10;
  leftBoard: Board;
  rightBoard: Board;
  yourShips: Ship[];
  oppShips: Ship[];
  showChat: Boolean;

  constructor() { }

  ngOnInit(): void {
    this.showChat = false;
    console.log(this.leftBoard);
  }

  updateShipCoord() {

  }

  test(event) {
    console.log(event);
    return;
  }
}
