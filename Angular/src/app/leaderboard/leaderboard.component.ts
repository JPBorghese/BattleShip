import { Component, OnInit } from '@angular/core';
import { Stat } from '../_models/stat';
import { UserService } from '../_services/user.service';

interface Filters {
  title: string;
  value: string;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  stats: Stat[];
  sortfilter;
  namefilter;
  filters: Filters[] = [
    { title: 'Wins', value: "wins" },
    { title: 'Score', value: 'score' },
    { title: 'Loss', value: 'loss' },
  ];

  default = this.filters[0].value;
  constructor(private userservice: UserService,

  ) { }

  ngOnInit(): void {
    this.sortfilter = "wins";
    this.namefilter = "";
    this.loadRanks(this.sortfilter, this.namefilter);
  }

  loadRanks(sortfilter, namefilter) {
    this.userservice.getstats().subscribe(

      (stats: Stat[]) => {
        this.namefilter = namefilter;
        stats.sort(this.sortRanks(sortfilter));
        this.setRankNums(stats);

        if (namefilter !== "") {
          this.stats = stats.filter((stat: Stat) => {
            return stat.username.includes(namefilter);
          });
        } else {
          this.stats = stats;
        }

      },
      error => {
        console.log(error, 'warning');
      });
  }

  private setRankNums(ranks) {
    for (let i = 0; i < ranks.length; i++) {
      ranks[i].ranking = i + 1;
    }
  }

  private sortRanks(prop) {
    return function (a, b) {
      if (a[prop] < b[prop]) {
        return 1;
      } else if (a[prop] > b[prop]) {
        return -1;
      }
      return 0;
    }
  }
}
