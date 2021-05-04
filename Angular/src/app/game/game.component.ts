import { Component, OnInit } from '@angular/core';
import { Ship } from '../_models/ship';
import { Tile } from '../_models/tile';
import { GameState } from '../_models/gamestate';
import { NotificationService } from '../_services/notification.service';

import { AuthService } from '../_services/auth';
import { Board } from '../_models/board';
import { User } from '../_models/user';
import { AppComponent } from '../app.component';

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
  leftTurn: boolean;
  hitAudio = new Audio('hit.mp3');
  constructor(private notif: NotificationService,
    private auth: AuthService,
    private app: AppComponent
  ) { }


  ngOnInit() {
    this.showChat = false;
    this.user = {
      username: "Guest",
    }

    this.auth.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    })

    this.leftBoard = {
      username: this.user.username,
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    this.rightBoard = {
      username: this.app.socket.opponent,
      state: GameState.placeCourier,
      tiles: this.initTiles(),
      ships: this.initShips()
    }

    if (!this.rightBoard.username) {
      this.rightBoard.username = "CPU";
    }

    this.hardCodeShips(this.leftBoard);
    // this.hardCodeShips(this.rightBoard);
    // this.rightBoard = this.initCPU();
    this.notif.showNotif("Place Courier by clicking on a coordinate on your board", "Ok");
  }

  vsCPU() {
    return this.rightBoard.username === "CPU";
  }

  turnIndicator(board: Board) {
    let color = "border: 4px solid green";
    let noBorder = "border: 4px solid white";
    //console.log(this.leftTurn);
    if (board === this.leftBoard) {
      return this.app.socket.userTurn == (true) ? color : noBorder;
    } else {
      return this.app.socket.userTurn == (false) ? color : noBorder;
    }

  }

  play() {
    var audio = new Audio('hit.mp3');
    audio.play();
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
        pos: [0, 1, 2, 3, 4],
      }
      board.ships[0].pos.push(i);
    }

    for (let i = 10; i < 14; i++) {
      board.tiles[i].ship = {
        name: "Battleship",
        pos: [10, 11, 12, 13],
      }
      board.ships[1].pos.push(i);
    }

    for (let i = 20; i < 23; i++) {
      board.tiles[i].ship = {
        name: "Cruiser",
        pos: [20, 21, 22],
      }
      board.ships[2].pos.push(i);
    }

    for (let i = 30; i < 32; i++) {
      board.tiles[i].ship = {
        name: "Submarine",
        pos: [30, 31],
      }
      board.ships[3].pos.push(i);
    }

    if (board.username === "CPU") {
      board.tiles[40].ship = {
        name: "Submarine",
        pos: [40],
      }
      board.ships[0].pos.push(40);
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
    if (board.state === GameState.fireRocket && board.username === this.user.username) {
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
    let shipRef = otherBoard.tiles[coord].ship;
    if (otherBoard.tiles[coord].ship) {
      // this.hitAudio.play();
      this.notif.showNotif("hit!", "Ok");
      otherBoard.ships.findIndex((ship) => {
        ship.name === shipRef.name
      })
    } else {
      this.notif.showNotif("miss!", "Ok");
    }
    otherBoard.tiles[coord].isBombed = true;
  }

  updateCPU() {
    function cpufire(otherboard: Board, notif: NotificationService, turn: boolean) {
      let coord = Math.floor(Math.random() * 99);
      this.fire(coord, otherboard);
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

        this.placeShip(board.ships[0], 5, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeBattleship: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Battleship";
          }
        })

        this.placeShip(board.ships[1], 4, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeCruiser: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Cruiser";
          }
        })

        this.placeShip(board.ships[2], 3, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeSub: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Submarine";
          }
        })

        this.placeShip(board.ships[3], 2, shipsPlaced, coord, board);
        break;
      }

      case GameState.placeDestroyer: {
        shipsPlaced = board.tiles.filter((tile) => {
          if (tile.ship) {
            return tile.ship.name === "Destroyer";
          }
        })

        this.placeShip(board.ships[4], 1, shipsPlaced, coord, board);
        if (this.leftBoard.state === GameState.waitForOpponent) {
          if (!this.vsCPU()) {
            let ships = {
              Courier: this.leftBoard.ships[0].pos,
              Battleship: this.leftBoard.ships[1].pos,
              Cruiser: this.leftBoard.ships[2].pos,
              Submarine: this.leftBoard.ships[3].pos,
              Destroyer: this.leftBoard.ships[4].pos,
            }

            this.app.socket.send(ships, 5);
            this.leftBoard.state = GameState.fireRocket;
            this.rightBoard.state = GameState.fireRocket;
            // setTimeout( () => {
            //   this.checkOpp();
            // }, 30000);            
          } else {
            this.leftBoard.state = GameState.fireRocket;
            this.rightBoard.state = GameState.fireRocket;
            this.leftTurn = (Math.floor(Math.random() * 2) == 0) ? true : false;
            this.notif.showNotif("Game Started!", "Ok");
            this.updateCPU();
          }
        }
        break;
      }

      case GameState.fireRocket: {
        if (this.vsCPU()) {
          this.leftTurn = (this.leftTurn) ? false : true;
          this.fire(coord, board);
          this.updateCPU();
        } else {
          console.log(this.app.socket.userTurn);
          if (this.app.socket.userTurn) {
            let move = {
              coord: coord,
            }
            this.app.socket.send(move, 2);
          }
        }
        break;
      }

      case GameState.gameOver: {
        break;
      }
    }
  }

  checkOpp() {
    if (this.app.socket.userTurn !== null) {
      this.leftBoard.state = GameState.fireRocket;
      this.rightBoard.state = GameState.fireRocket;
      let turn = (this.app.socket.userTurn) ? this.app.socket.username : this.app.socket.opponent;
      this.notif.showNotif("Game Started," + turn + "'s " + "turn!", "Ok");
    }
  }
}
