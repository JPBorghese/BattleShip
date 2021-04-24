import { Component, OnInit, ViewChild } from '@angular/core';
import { Ship } from '../_models/ship';
import { Tile } from '../_models/tile';
import { GameState } from '../_models/gamestate';
import { NotificationService } from '../_services/notification.service';

import { WebsocketService } from '../_services/websocket.service';
import { AuthService } from '../_services/auth';
import { Board } from '../_models/board';
import { User } from '../_models/user';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  leftBoard: Board;
  rightBoard: Board;
  showChat: Boolean;
  state: GameState;
  user: User;
  constructor(private notif: NotificationService,
    private socket: WebsocketService,
    private auth: AuthService
  ) { }


  ngOnInit() {
    this.showChat = false;

    this.leftBoard = {
      user: "",
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    this.rightBoard = {
      user: "CPU",
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    this.auth.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
        this.leftBoard.user = user.username;
      } else {
        this.leftBoard.user = "Guest";
      }
    })

    this.notif.showNotif("Place Courier by clicking on a coordinate on your board", "Ok");
  }

  initTiles(): Tile[] {
    let tiles;
    tiles = [{
      coord: 0,
      ship: null,
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

    return ships;
  }

  shipColor(ship: Ship): String {
    if (ship) {
      if (ship.name === "Courier") {
        return "green";
      } else if (ship.name === "Destroyer") {
        return "yellow";
      } else if (ship.name === "Battleship") {
        return "purple";
      } else if (ship.name === "Cruiser") {
        return "orange";
      } else if (ship.name === "Submarine") {
        return "red";
      }
    }
    return "lightblue";
  }

  validPlacement(shipsPlaced: Tile[], coord: number, board): boolean {
    if (board.tiles[coord].ship) { //coord is already been placed
      return false;
    }

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

  placingShips(board): boolean {
    return board.state === GameState.placeCourier || 
    board.state === GameState.placeBattleship || 
    board.state === GameState.placeCruiser || 
    board.state === GameState.placeSub || 
    board.state === GameState.placeDestroyer;
  }

  nextState(state): GameState {
    let res = (state === GameState.placeCourier) ? GameState.placeBattleship:
    (state === GameState.placeBattleship) ? GameState.placeCruiser:
    (state === GameState.placeCruiser) ? GameState.placeSub: 
    (state === GameState.placeSub) ? GameState.placeDestroyer:
    (state === GameState.placeDestroyer) ? GameState.waitForOpponent: null;
    return res;
  }

  nextShip(state): String {
    let res = (state === GameState.placeCourier) ? "Battleship":
    (state === GameState.placeBattleship) ? "Cruiser":
    (state === GameState.placeCruiser) ? "Sub": 
    (state === GameState.placeSub) ? "Destroyer":
    (state === GameState.placeDestroyer) ? "waitForOpponent": null;
    return res;
  }

  placeShip(chosenShip, placelimit, shipsPlaced, coord, board) {
    let shipName = chosenShip.name;
    if (shipsPlaced.length < placelimit && this.validPlacement(shipsPlaced, coord, board)) {
      chosenShip.pos.push(coord);
      board.tiles[coord].ship = chosenShip;
      this.notif.showNotif("Placed " + shipName + " on coordinate " + coord + ", " + (placelimit - shipsPlaced.length - 1) + " left", "Ok");
      if (shipsPlaced.length === placelimit - 1) {
        let nextShip = this.nextShip(board.state);
        board.state = this.nextState(board.state);
        if (nextShip !== "waitForOpponent") {
          this.notif.showNotif("Place " + nextShip + " by clicking on a coordinate on your board", "Ok");
        } else {
          this.notif.showNotif("Waiting for opponent to finish placing", "Ok");
        }
      }
    } else {
      this.notif.showNotif("Invalid Placement", "Ok");
    }
  }

  resetShips(board: Board): Board {
    board = {
      user: board.user,
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    return board;
  }

  update(coord: number, board: Board) {
    let chosenShip: Ship;
    let placelimit: number;
    let shipsPlaced: Tile[];

    switch (board.state) {
      case GameState.placeCourier: {

        chosenShip = board.ships[0];
        placelimit = board.ships[0].holes;
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Courier";
          }
        })

        this.placeShip(chosenShip, placelimit, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeBattleship: {
        chosenShip = board.ships[1];
        placelimit = board.ships[1].holes;
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Battleship";
          }
        })

        this.placeShip(chosenShip, placelimit, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeCruiser: {
        chosenShip = board.ships[2];
        placelimit = board.ships[2].holes;
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Cruiser";
          }
        })

        this.placeShip(chosenShip, placelimit, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeSub: {
        chosenShip = board.ships[3];
        placelimit = board.ships[3].holes;
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Submarine";
          }
        })

        this.placeShip(chosenShip, placelimit, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeDestroyer: {
        chosenShip = board.ships[4];
        placelimit = board.ships[4].holes;
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Destroyer";
          }
        })

        this.placeShip(chosenShip, placelimit, shipsPlaced, coord, board);
        break;
      }
    }
  }

  send(msg) {
    this.socket.send('HI');
  }
}
