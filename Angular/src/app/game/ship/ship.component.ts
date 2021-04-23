import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ship } from '../../_models/ship';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})

export class ShipComponent implements OnInit {
  @Input() ship: Ship;
  name = "";
  holes = 0;
  constructor() { }

  ngOnInit(): void {

  }
}
