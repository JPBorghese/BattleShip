import { Component, OnInit, Inject } from '@angular/core';
import {AppComponent} from '../app.component';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(public appComponent: AppComponent, 
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
}

@Component({
  selector: 'searching-dialog',
  templateUrl: 'searching-dialog.html',
})
export class searchingDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public app: AppComponent
  ) {}
  cancel() {
  }
}
