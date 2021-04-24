import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Ship } from '../_models/ship';
import { Board } from '../_models/board';
import { Tile } from '../_models/tile';
import { GameState } from '../_models/gamestate';
import { BoardComponent } from './board/board.component';
import { NotificationService } from '../_services/notification.service';

import {WebsocketService} from '../_services/websocket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements AfterViewInit {

  @ViewChild(BoardComponent) board;

  width = 10;
  height = 10;
  leftBoard: Tile[];
  rightBoard: Tile[];
  leftShips: Ship[];
  rightShips: Ship[];
  showChat: Boolean;
  state: GameState;

  constructor(private cdr: ChangeDetectorRef,
    private notif: NotificationService, 
    private socket: WebsocketService
  ) { }

  ngAfterViewInit() {
    this.showChat = false;
    this.leftBoard = this.board.tiles;
    this.rightBoard = this.board.tiles;
    this.leftShips = this.board.ships;
    this.rightShips = this.board.ships;
    this.cdr.detectChanges();

    this.state = GameState.placeCourier;
  }

  validPlacement(shipsPlaced: Tile[], coord: number): boolean {
    if (shipsPlaced.length === 0) {
      return true;
    }

    if (shipsPlaced.length === 1) {
      return coord === (shipsPlaced[0].coord - 1) ||
      coord === (shipsPlaced[0].coord + 1) ||
      coord === (shipsPlaced[0].coord - 10) ||
      coord === (shipsPlaced[0].coord + 10);
    }

    //if length is 2 or greater. 
    if (shipsPlaced[0].ship.pos.includes(coord)) { //coord is already been placed
      return false;
    }

    let first = shipsPlaced[0].coord;
    let before = shipsPlaced[shipsPlaced.length - 2].coord;
    let last = shipsPlaced[shipsPlaced.length - 1].coord;
    let dir = last - before;
    if (dir === 10) { // up/down
      if (coord % 10 !== last % 10 || coord % 10 !== first % 10) {
        return false;
      }
      return (coord === (first - 10) || 
      coord === (first + 10) || 
      coord === (last - 10) || 
      coord === (last + 10));
    }

    if (dir === 1) { //right/left
      if (Math.floor(coord / 10) !== Math.floor(last / 10) || Math.floor(coord / 10) !== Math.floor(first / 10)) {
        return false;
      }
      return (coord === (first - 1) || 
      coord === (first + 1) || 
      coord === (last - 1) || 
      coord === (last + 1));
    }

    return false;
  }

  update(coord: number) {
    let chosenShip;
    let placelimit;
    let shipsPlaced;
    switch (this.state) {
      case GameState.placeCourier: {
        chosenShip = this.leftShips[0];
        placelimit = this.leftShips[0].holes;
        shipsPlaced = this.leftBoard.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Courier";
          }
        })
        if (shipsPlaced.length < 5 && this.validPlacement(shipsPlaced, coord)) {
          chosenShip.pos.push(coord);
          this.leftBoard[coord].ship = chosenShip;
        }
        console.log(shipsPlaced);
        break;
      }
    }
  }
  send(msg) {
    this.socket.send('HI');
  }
}
