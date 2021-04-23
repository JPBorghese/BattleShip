import { Component, OnInit } from '@angular/core';
import { Ship } from '../_models/ship';
import { Board } from '../_models/board';

import {WebsocketService} from '../_services/websocket.service';

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

  constructor(private socket: WebsocketService) { }

  ngOnInit(): void {
    this.showChat = false;
    console.log(this.leftBoard);
  }

  updateShipCoord() {

  }

  send(msg) {
    this.socket.send('HI');
  }

  test(event) {
    console.log(event);
    return;
  }
}
