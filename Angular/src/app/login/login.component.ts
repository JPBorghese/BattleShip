import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {AuthService} from '../_services/auth';
import {Router} from '@angular/router';
import {NotificationService} from '../_services/notification.service';
import {AppComponent} from '../app.component';
@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  submitted = false;
  error = '';

  username: string;
  password: string;

  constructor(private router: Router,
     private authService: AuthService,
    //  private notif: NotificationService, 
     private app: AppComponent
     ) { }
  // constructor(){}

  ngOnInit(): void {
  }

  login() {
    this.submitted = true;

    this.loading = true;

    this.authService.login(this.username, this.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['']);

          // this.notif.showNotif('Logged in as: ' + this.username, 'confirmation');
          
        },
        error => {
          this.error = error;
          this.loading = false;
          // show a snackbar to user
          // this.notif.showNotif(this.error, 'dismiss');
          console.log('Error', error);
        });
  }

  register() {
    // this.notif.notImplementedWarning('Registration', 500);
  }

}
