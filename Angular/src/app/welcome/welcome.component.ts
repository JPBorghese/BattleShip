import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
  }

}
