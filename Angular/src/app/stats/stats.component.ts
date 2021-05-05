import { Component, Input, OnInit } from '@angular/core';
import { Stat } from '../_models/stat';

@Component({
  selector: 'stat-component',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  @Input() stat: Stat;

  ranking;
  username;
  wins;
  loss;
  score;
  userLogged;

  constructor(
    ) { }

  ngOnInit(): void {
    //console.log(this.stat);
    this.ranking = this.stat.ranking;
    this.wins = this.stat.wins;
    this.username = this.stat.username;
    this.loss = this.stat.loss;
    this.score = this.stat.score;
  }

}
