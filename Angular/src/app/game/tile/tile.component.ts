import { Component, OnInit } from '@angular/core';
import {Tile} from '../../_models/tile';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

  tile: Tile;

  ngOnInit(): void {
    this.tile.coord = null;
    this.tile.hasBoat = false;
    this.tile.isBombed = false;
  }
  
}
