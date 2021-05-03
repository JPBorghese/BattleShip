import { Component, OnInit } from '@angular/core';
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
  cpu: User;
  leftTurn: boolean;
  constructor(private notif: NotificationService,
    private socket: WebsocketService,
    private auth: AuthService
  ) { }


  ngOnInit() {
    this.showChat = false;
    this.auth.currentUser.subscribe((user) => {
      this.user = user;
    })
    this.leftBoard = {
      username: this.user.username,
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    this.rightBoard = {
      username: "",
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    this.hardCodeShips(this.leftBoard);
    // this.hardCodeShips(this.rightBoard);
    this.rightBoard = this.initCPU();
    this.notif.showNotif("Place Courier by clicking on a coordinate on your board", "Ok");
  }

  turnIndicator(board: Board) {
    let color = "border: 4px solid green";
    let res = "";
    //console.log(this.leftTurn);
    if (board === this.leftBoard) {
      return this.leftTurn == (true) ? color : noBorder;
    } else {
      return this.leftTurn == (false) ? color : noBorder;
    }

  }

  initCPU() {
    let board = {
      username: "CPU",
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    this.hardCodeShips(board);
    return board;
  }

  hardCodeShips(board: Board) {
    //hard code locations for now
    for (let i = 0; i < 5; i++) {
      board.tiles[i].ship = {
        name: "Courier",
        holes: 5,
        pos: [0, 1, 2, 3, 4],
      }
    }

    for (let i = 10; i < 14; i++) {
      board.tiles[i].ship = {
        name: "Battleship",
        holes: 4,
        pos: [10, 11, 12, 13],
      }
    }

    for (let i = 20; i < 23; i++) {
      board.tiles[i].ship = {
        name: "Cruiser",
        holes: 3,
        pos: [20, 21, 22],
      }
    }

    for (let i = 30; i < 32; i++) {
      board.tiles[i].ship = {
        name: "Submarine",
        holes: 2,
        pos: [30, 31],
      }
    }

    if (board.username === "CPU") {
      board.tiles[40].ship = {
        name: "Submarine",
        holes: 1,
        pos: [40],
      }
      board.state = GameState.waitForOpponent;
    } else {
      board.state = GameState.placeDestroyer;
    }
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

  isBoardTurn(board: Board) {
    return (board === this.leftBoard && this.leftTurn) || (board === this.rightBoard && !this.leftTurn);
  }

  disableButtons(board: Board) {
    if(board.state === GameState.fireRocket && board.username === this.user.username) {
      return true;
    }

    if (board.state === GameState.fireRocket && this.isBoardTurn(board)) {
      return true;
    }
  }

  shipColor(ship: Ship, board: Board): String {
    if (ship && board.username === this.user.username) {
      if (ship.name === "Courier") {
        return "grey";
      } else if (ship.name === "Destroyer") {
        return "yellow";
      } else if (ship.name === "Battleship") {
        return "purple";
      } else if (ship.name === "Cruiser") {
        return "orange";
      } else if (ship.name === "Submarine") {
        return "brown";
      }
    }
    return "lightblue";
  }

  shipLabels(ship: Ship): String {
    if (ship.name === "Courier") {
      return "grey";
    } else if (ship.name === "Destroyer") {
      return "yellow";
    } else if (ship.name === "Battleship") {
      return "purple";
    } else if (ship.name === "Cruiser") {
      return "orange";
    } else if (ship.name === "Submarine") {
      return "brown";
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
    if (board.username === this.user.username) {
      return board.state === GameState.placeCourier ||
        board.state === GameState.placeBattleship ||
        board.state === GameState.placeCruiser ||
        board.state === GameState.placeSub ||
        board.state === GameState.placeDestroyer;
    }
    return false;
  }

  nextState(state): GameState {
    let res = (state === GameState.placeCourier) ? GameState.placeBattleship :
      (state === GameState.placeBattleship) ? GameState.placeCruiser :
        (state === GameState.placeCruiser) ? GameState.placeSub :
          (state === GameState.placeSub) ? GameState.placeDestroyer :
            (state === GameState.placeDestroyer) ? GameState.waitForOpponent : null;
    return res;
  }

  nextShip(state): String {
    let res = (state === GameState.placeCourier) ? "Battleship" :
      (state === GameState.placeBattleship) ? "Cruiser" :
        (state === GameState.placeCruiser) ? "Sub" :
          (state === GameState.placeSub) ? "Destroyer" :
            (state === GameState.placeDestroyer) ? "waitForOpponent" : null;
    return res;
  }

  placeShip(chosenShip, placelimit, shipsPlaced, coord, board) {
    if (this.user.username === board.username) {
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
    } else {
      this.notif.showNotif("Not your board", "Ok");
    }
  }

  resetShips(board: Board): Board {
    board = {
      username: board.username,
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }
    return board;
  }

  fire(coord: number, otherBoard: Board) {
    if (otherBoard.tiles[coord].ship) {
      this.notif.showNotif("hit!", "Ok");
    } else {
      this.notif.showNotif("miss!", "Ok");
    }
    otherBoard.tiles[coord].isBombed = true;
  }

  // cpufire(otherboard: Board) {
  //   let coord = Math.floor(Math.random() * 99);
  //   if (otherboard.tiles[coord].ship) {
  //     this.notif.showNotif("hit!", "Ok");
  //   } else {
  //     this.notif.showNotif("miss!", "Ok");
  //   }
  //   otherboard.tiles[coord].isBombed = true;
  // }

  updateCPU() {
    function cpufire(otherboard: Board, notif: NotificationService, turn: boolean) {
      let coord = Math.floor(Math.random() * 99);
      if (otherboard.tiles[coord].ship) {
        notif.showNotif("hit!", "Ok");
      } else {
        notif.showNotif("miss!", "Ok");
      }
      otherboard.tiles[coord].isBombed = true;
      return (turn) ? false : true;
      
    }

    if (!this.leftTurn && this.rightBoard.username === "CPU") {
      setTimeout(() => { this.leftTurn = cpufire(this.leftBoard, this.notif, this.leftTurn) }, 1000);
    } else if (this.leftTurn && this.leftBoard.username === "CPU") {
      setTimeout(() => { this.leftTurn = cpufire(this.rightBoard, this.notif, this.leftTurn) }, 1000);
    }
  }



  update(coord: number, board: Board, otherBoard: Board) {
    let shipsPlaced: Tile[];

    switch (board.state) {
      case GameState.placeCourier: {

        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Courier";
          }
        })

        this.placeShip(board.ships[0], board.ships[0].holes, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeBattleship: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Battleship";
          }
        })

        this.placeShip(board.ships[1], board.ships[1].holes, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeCruiser: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Cruiser";
          }
        })

        this.placeShip(board.ships[2], board.ships[2].holes, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeSub: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Submarine";
          }
        })

        this.placeShip(board.ships[3], board.ships[3].holes, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeDestroyer: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Destroyer";
          }
        })

        this.placeShip(board.ships[4], board.ships[4].holes, shipsPlaced, coord, board);
        if (this.leftBoard.state === GameState.waitForOpponent && this.rightBoard.state === GameState.waitForOpponent) {
          this.leftBoard.state = GameState.fireRocket;
          this.rightBoard.state = GameState.fireRocket;
          this.leftTurn = (Math.floor(Math.random() * 2) == 0) ? true : false;
          this.notif.showNotif("Game Started!", "Ok");
        }

        this.updateCPU();
        break;
      }

      case GameState.fireRocket: {
        this.leftTurn = (this.leftTurn) ? false : true;
        this.fire(coord, board);
        this.updateCPU();
        break;
      }
    }
  }

  send(msg) {
    this.socket.send('HI');
  }
}
