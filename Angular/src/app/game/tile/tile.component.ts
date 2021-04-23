import { Component, OnInit } from '@angular/core';
import {Tile} from '../../_models/tile';
import {Ship} from '../../_models/ship';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

  tile: Tile;

  ngOnInit(): void {
    this.tile.coord = null;
    this.tile.ship = undefined;
    this.tile.isBombed = false;
  }
  
  setShip(ship: Ship): void {
    this.tile.ship = ship;
  }

  
}
