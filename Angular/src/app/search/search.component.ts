import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'search-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private appComponent: AppComponent) { }
  test = "";
  ngOnInit(): void {
    
  }

  cpu() {
    
  }

  search() {
    this.appComponent.connectSocket();
    this.appComponent.searchOpponent();
  }
}
