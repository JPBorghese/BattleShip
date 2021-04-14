import { Component, OnInit } from '@angular/core';

interface tile {
  coord: number;
  hasBoat: boolean;
  isBombed: boolean;
}

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  board: tile[];
  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
      this.board[i].coord = i;
      this.board[i].hasBoat = false;
      this.board[i].isBombed = false;
    }
    console.log(this.board);
  }

}
