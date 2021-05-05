import { Component } from '@angular/core';
import {AuthService} from './_services/auth';
import {WebsocketService} from './_services/websocket.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BattleShip';

  userLogged;
  constructor(private authService: AuthService,
    public socket: WebsocketService,
    private router: Router) {}
  
  
  isLoggedIn() {
    return this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
  }

  isInGame() {
    return this.router.url === '/game';
  }

  connectSocket() {
    this.socket.connect();
  }

  searchOpponent() {
    this.socket.searchForOpponent();
  }
}
