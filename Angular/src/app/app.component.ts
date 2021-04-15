import { Component } from '@angular/core';
import {AuthService} from './_services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BattleShip';

  constructor(private authService: AuthService) {}

  isLoggedIn() {
    return this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
  }
}
