import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Board } from "../../_models/board";
import { Tile } from "../../_models/tile";
import { Ship } from "../../_models/ship";


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() board: Board;
  
  
  constructor() { }

  ngOnInit(): void {
  }

}
