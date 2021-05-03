import { Component } from '@angular/core';
import {AuthService} from './_services/auth';
import {WebsocketService} from './_services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BattleShip';

  constructor(private authService: AuthService,
    private socket: WebsocketService) {}

  isLoggedIn() {
    return this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
  }

  connectSocket() {
    this.socket.connect();
  }

  searchOpponent() {
    this.socket.searchForOpponent();
  }
}
