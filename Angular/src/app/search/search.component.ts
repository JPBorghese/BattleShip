import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
    
  }

  searching() {
    this.dialog.open(searchingDialog);
  }
}

@Component({
  selector: 'searching-dialog',
  templateUrl: 'searching-dialog.html',
})
export class searchingDialog {}
