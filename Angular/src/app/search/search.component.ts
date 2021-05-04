import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AppComponent} from '../app.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private appComponent: AppComponent, 
    public dialog: MatDialog) { }
  ngOnInit(): void {
  }

  searching() {
    this.dialog.open(searchingDialog, {
      closeOnNavigation: true
    });
    this.appComponent.connectSocket();
    this.appComponent.searchOpponent();
  }

  close() {
  }
}

@Component({
  selector: 'searching-dialog',
  templateUrl: 'searching-dialog.html',
})
export class searchingDialog {}
