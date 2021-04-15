import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string;
  password: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  register() {
    this.userService.register(this.username, this.password).pipe(first())
      .subscribe( data => {
        console.log(data);
      },
      error => {
        console.log(error);
      });
  }

}
