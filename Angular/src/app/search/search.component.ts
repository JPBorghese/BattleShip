import { Component, OnInit, Inject } from '@angular/core';
import {AppComponent} from '../app.component';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WebsocketService } from '../_services/websocket.service';

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
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.appComponent;
    dialogConfig.disableClose = true;
    this.dialog.open(searchingDialog, dialogConfig);
    console.log(this.appComponent);
    this.appComponent.connectSocket();
    this.appComponent.searchOpponent();
  }
}

@Component({
  selector: 'searching-dialog',
  templateUrl: 'searching-dialog.html',
})
export class searchingDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public app: AppComponent,
  private dialog: MatDialog
  ) {}

  cancel() {
    this.app.stopSearch();
    this.dialog.closeAll();
  }
}
