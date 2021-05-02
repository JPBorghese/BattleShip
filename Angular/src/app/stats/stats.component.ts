import { Component, Input, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth';
import { Stat } from '../_models/stat';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  @Input() stat: Stat;
  @Input() bgColor: string;

  ranking;
  username;
  wins;
  loss;
  score;
  userLogged;

  constructor(private auth : AuthService
    ) { }

  ngOnInit(): void {
    this.ranking = this.stat.ranking;
    this.wins = this.stat.wins;
    this.loss = this.stat.loss;
    this.score = this.stat.score;
    this.auth.currentUser.subscribe( user => {
      this.userLogged = user.username;
    });
  }

}
