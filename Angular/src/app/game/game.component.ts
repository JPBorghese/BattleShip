import { Component, OnInit } from '@angular/core';
import { Ship } from '../_models/ship';
import { Tile } from '../_models/tile';
import { GameState } from '../_models/gamestate';
import { NotificationService } from '../_services/notification.service';

import { AuthService } from '../_services/auth';
import { Board } from '../_models/board';
import { User } from '../_models/user';
import { AppComponent } from '../app.component';
import { WebsocketService } from '../_services/websocket.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  chatMessage: string;

  leftBoard: Board;
  rightBoard: Board;
  showChat: Boolean;
  state: GameState;
  user: User;
  // hitAudio = new Audio('hit.mp3');
  constructor(private notif: NotificationService,
    private auth: AuthService,
    private app: AppComponent
  ) { }



  ngOnInit() {
    this.app.socket.update.subscribe(msg => this.msgReceived(msg));
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
      this.rightBoard = this.initCPU();
      this.app.socket.username = this.user.username;
      this.app.socket.opponent = "CPU";
    }

    this.hardCodeShips(this.leftBoard);
    this.notif.showNotif("Place Courier by clicking on a coordinate on your board", "Ok");
  }

  msgReceived(msg) {
    if (msg.type === 2) {
      console.log(msg);
      console.log("Opponent Moved");
      console.log(this.app.socket.userTurn);
      this.fire(msg.message, this.leftBoard);
      console.log(this.app.socket.userTurn);
      this.checkWinner();
    }
  }

  vsCPU() {
    return this.rightBoard.username === "CPU";
  }

  randomlyPlaceShips(board) {

    let possibleCourier = [];
    let possibleBattleship = [];
    let possibleCruiser = [];
    let possibleSubmarine = [];
    let possibleDestroyer = [];

    for (let i = 0; i < 100; i++) {
      //Horizontals
      if (i % 10 <= 5) {
        possibleCourier.push([i, i + 1, i + 2, i + 3, i + 4]);
      }

      if (i % 10 <= 6) {
        possibleBattleship.push([i, i + 1, i + 2, i + 3]);
      }

      if (i % 10 <= 7) {
        possibleCruiser.push([i, i + 1, i + 2]);
      }

      if (i % 10 <= 8) {
        possibleSubmarine.push([i, i + 1]);
      }

      possibleDestroyer.push([i]);

      //Verticals
      if (i + 40 < 100) {
        possibleCourier.push([i, i + 10, i + 20, i + 30, i + 40]);
      }
      if (i + 30 < 100) {
        possibleBattleship.push([i, i + 10, i + 20, i + 30]);
      }
      if (i + 20 < 100) {
        possibleCruiser.push([i, i + 10, i + 20]);
      }
      if (i + 10 < 100) {
        possibleSubmarine.push([i, i + 10]);
      }
    }

    function findSameIndex(arr1, arr2) {
      return arr1.some(item => arr2.includes(item))
    }

    let chosen = [];
    let chosenCourier = possibleCourier[Math.floor(Math.random() * possibleCourier.length)];
    chosen.push(chosenCourier);

    let chosenBattleship = possibleBattleship.filter((arr) => {
      return !findSameIndex(arr, chosen);
    });
    chosenBattleship = chosenBattleship[Math.floor(Math.random() * chosenBattleship.length)];
    chosen.push(chosenBattleship);

    let chosenCruiser = possibleCruiser.filter((arr) => {
      return !findSameIndex(arr, chosen);
    });
    chosenCruiser = chosenCruiser[Math.floor(Math.random() * chosenCruiser.length)];
    chosen.push(chosenCruiser);

    let chosenSubmarine = possibleSubmarine.filter((arr) => {
      return !findSameIndex(arr, chosen);
    });
    chosenSubmarine = chosenSubmarine[Math.floor(Math.random() * chosenSubmarine.length)];
    chosen.push(chosenSubmarine);

    let chosenDestroyer = possibleDestroyer.filter((arr) => {
      return !findSameIndex(arr, chosen);
    });
    chosenDestroyer = chosenDestroyer[Math.floor(Math.random() * chosenDestroyer.length)];
    chosen.push(chosenDestroyer);

    for (let pos of chosenCourier) {
      board.tiles[pos].ship = {
        name: "Courier",
        pos: chosenCourier,
      }
      board.ships[0].pos.push(pos);
    }

    for (let pos of chosenBattleship) {
      board.tiles[pos].ship = {
        name: "Battleship",
        pos: chosenBattleship,
      }
      board.ships[1].pos.push(pos);
    }

    for (let pos of chosenCruiser) {
      board.tiles[pos].ship = {
        name: "Cruiser",
        pos: chosenCruiser,
      }
      board.ships[2].pos.push(pos);
    }

    for (let pos of chosenSubmarine) {
      board.tiles[pos].ship = {
        name: "Submarine",
        pos: chosenSubmarine,
      }
      board.ships[3].pos.push(pos);
    }

    board.tiles[chosenDestroyer[0]].ship = {
      name: "Destroyer",
      pos: chosenDestroyer,
    }
    board.ships[4].pos.push(chosenDestroyer[0]);

    board.state = GameState.waitForOpponent;
  }

  turnIndicator(board: Board) {
    let color = "border: 4px solid green";
    let noBorder = "border: 4px solid white";

    if (board.state !== GameState.fireRocket) {
      return noBorder;
    }

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

    this.randomlyPlaceShips(board);
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
        name: "Destroyer",
        pos: [40],
      }
      board.ships[4].pos.push(40);
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
      pos: [],
    }];

    for (let i = 4; i >= 1; i--) {
      ships.push({
        ...(i === 4 && { name: "Battleship" }),
        ...(i === 3 && { name: "Cruiser" }),
        ...(i === 2 && { name: "Submarine" }),
        ...(i === 1 && { name: "Destroyer" }),
        pos: [],
      });
    }

    return ships;
  }

  isBoardTurn(board: Board) {
    return (board === this.leftBoard && this.app.socket.userTurn) || (board === this.rightBoard && !this.app.socket.userTurn);
  }

  disableButtons(board: Board) {
    if (board.state === GameState.fireRocket && board.username === this.user.username) {
      return true;
    }

    return (!this.app.socket.userTurn);
  }

  shipColor(tile: Tile, board: Board): String {
    if ((tile.ship && board.username === this.user.username) || (tile.ship && tile.isBombed)) {
      if (tile.ship.name === "Courier") {
        return "grey";
      } else if (tile.ship.name === "Destroyer") {
        return "yellow";
      } else if (tile.ship.name === "Battleship") {
        return "purple";
      } else if (tile.ship.name === "Cruiser") {
        return "orange";
      } else if (tile.ship.name === "Submarine") {
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

    if (otherBoard.tiles[coord].isBombed) {
      return;
    }

    if (otherBoard.tiles[coord].ship) {
      // this.hitAudio.play();
      let shipRef = otherBoard.tiles[coord].ship;
      this.notif.showNotif("hit!", "Ok");
      let shipIndex = otherBoard.ships.findIndex(x => x.name === shipRef.name);
      let posIndex = otherBoard.ships[shipIndex].pos.findIndex(x => x === coord);
      otherBoard.ships[shipIndex].pos.splice(posIndex, 1);
    } else {
      this.notif.showNotif("miss!", "Ok");
    }
    otherBoard.tiles[coord].isBombed = true;
    this.app.socket.userTurn = (this.app.socket.userTurn) ? false : true;
  }

  updateCPU() {

    if (this.app.socket.userTurn) {
      return;
    }

    function cpufire(otherBoard: Board, notif: NotificationService) {
      let coord = Math.floor(Math.random() * 100);
      if (otherBoard.tiles[coord].ship) {
        // this.hitAudio.play();
        let shipRef = otherBoard.tiles[coord].ship;
        notif.showNotif("hit!", "Ok");
        let shipIndex = otherBoard.ships.findIndex(x => x.name === shipRef.name);
        let posIndex = otherBoard.ships[shipIndex].pos.findIndex(x => x === coord);
        otherBoard.ships[shipIndex].pos.splice(posIndex, 1);
      } else {
        notif.showNotif("miss!", "Ok");
      }
      otherBoard.tiles[coord].isBombed = true;
    }

    setTimeout(() => {
      cpufire(this.leftBoard, this.notif);
      this.app.socket.userTurn = true;
    }, 100);
  }

  updateOpp() {

    if (this.app.socket.userTurn) {
      return;
    }


    function oppfire(otherBoard: Board, notif: NotificationService, socket: WebsocketService) {

      let coord = socket.oppMove;
      console.log(otherBoard.username + ": " + JSON.stringify(otherBoard));
      console.log(coord);
      if (otherBoard.tiles[coord].ship) {
        // this.hitAudio.play();
        let shipRef = otherBoard.tiles[coord].ship;
        notif.showNotif("hit!", "Ok");
        let shipIndex = otherBoard.ships.findIndex(x => x.name === shipRef.name);
        let posIndex = otherBoard.ships[shipIndex].pos.findIndex(x => x === coord);
        otherBoard.ships[shipIndex].pos.splice(posIndex, 1);
      } else {
        notif.showNotif("miss!", "Ok");
      }
      otherBoard.tiles[coord].isBombed = true;
      this.app.socket.userTurn = (this.app.socket.userTurn) ? false : true;
    }

    setTimeout(() => {
      oppfire(this.leftBoard, this.notif, this.app.socket);
      this.app.socket.userTurn = true;
    }, 100);
  }

  placeOppShips(board: Board, oppBoats) {
    for (let i = 0; i < 5; i++) {
      board.tiles[oppBoats.Courier[i]].ship = {
        name: "Courier",
        pos: oppBoats.Courier,
      }
      board.ships[0].pos.push(i);
    }

    for (let i = 0; i < 4; i++) {
      board.tiles[oppBoats.Battleship[i]].ship = {
        name: "Battleship",
        pos: oppBoats.BattleShip,
      }
      board.ships[1].pos.push(i);
    }

    for (let i = 0; i < 3; i++) {
      board.tiles[oppBoats.Cruiser[i]].ship = {
        name: "Cruiser",
        pos: oppBoats.Cruiser,
      }
      board.ships[2].pos.push(i);
    }

    for (let i = 0; i < 2; i++) {
      board.tiles[oppBoats.Submarine[i]].ship = {
        name: "Submarine",
        pos: oppBoats.Submarine,
      }
      board.ships[3].pos.push(i);
    }

    board.tiles[oppBoats.Destroyer[0]].ship = {
      name: "Destroyer",
      pos: oppBoats.Destroyer,
    }
    board.ships[4].pos.push(oppBoats.Destroyer[0]);
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
            function checkDone(opp, rightBoard, placeOppShips) {
              if (opp != null) {
                console.log("opp: " + opp.username + ", " + opp.boats);
                placeOppShips(rightBoard, opp.boats);
                rightBoard.state = GameState.fireRocket;
                clearInterval(poll);
              }
            }

            var poll = setInterval(() => {
              checkDone(this.app.socket.opp, this.rightBoard, this.placeOppShips);
            }, 1000);

          } else {
            this.leftBoard.state = GameState.fireRocket;
            this.rightBoard.state = GameState.fireRocket;
            this.app.socket.userTurn = (Math.floor(Math.random() * 2) == 0) ? true : false;
            let turn = (this.app.socket.userTurn) ? this.leftBoard.username : this.rightBoard.username;
            this.notif.showNotif("Game Started, " + turn + "'s " + "turn!", "Ok");
            this.updateCPU();
          }
        }
        break;
      }

      case GameState.fireRocket: {
        if (this.vsCPU()) {
          this.fire(coord, board);
          this.checkWinner();
          this.updateCPU();
          this.checkWinner();
        } else {
          let move = {
            coord: coord,
          }
          this.app.socket.send(move, 2);
          this.fire(coord, board);
          this.checkWinner();
        }
        break;
      }


      case GameState.gameOver: {
        break;
      }
    }
  }

  checkWinner() {
    let leftLength = 0;
    for (let ship of this.leftBoard.ships) {
      leftLength += ship.pos.length;
    }
    if (leftLength === 0) {
      this.notif.showNotif(this.app.socket.opponent + " wins!")
      this.leftBoard.state = GameState.gameOver;
      this.rightBoard.state = GameState.gameOver;
    }

    let rightLength = 0;
    for (let ship of this.rightBoard.ships) {
      rightLength += ship.pos.length;
    }
    if (rightLength === 0) {
      this.notif.showNotif(this.app.socket.username + " wins!")
      this.leftBoard.state = GameState.gameOver;
      this.rightBoard.state = GameState.gameOver;
    }
  }
}
