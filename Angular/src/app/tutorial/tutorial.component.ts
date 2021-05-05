import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  page: number;

  constructor() { }

  ngOnInit(): void {
    this.page = 1;
  }

  getPage() {
    return this.page;
  }

  nextPage() {
    if (this.page < 8) {
      this.page += 1;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page -= 1;
    }
  }
}
