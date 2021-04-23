import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Tile} from '../../_models/tile';
import {Ship} from '../../_models/ship';

@Component({
  selector: 'tile-component',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input() tile: Tile;
  @Output() setShip = new EventEmitter();
  @Output() setBombed = new EventEmitter();

  coord: number
  ship: Ship
  isBombed: boolean

  ngOnInit(): void {
    this.coord = this.tile.coord;
    this.ship = this.tile.ship;
    this.isBombed = this.tile.isBombed;
  }

  test(): void {
    console.log(this.coord);
  }
}
