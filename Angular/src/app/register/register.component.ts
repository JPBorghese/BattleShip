import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService } from '../_services/user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private userService: UserService,
    private router: Router,
    private notif: NotificationService
  ) { }

  ngOnInit(): void {
  }

  register() {
    if (this.username === "" || this.password === "") {
      this.notif.showNotif("Username or password not filled", "Ok");
      return;
    }

    this.userService.register(this.username, this.password).pipe(first())
      .subscribe(data => {
        console.log(data);
        this.notif.showNotif("Successfully registered " + this.username, "Ok");
        this.router.navigate(['login']);
      },
        error => {
          console.log(error);
        });
  }

}
