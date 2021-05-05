
import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {AuthService} from '../_services/auth';
import {User} from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {


  constructor(private http: HttpClient,
    private authService: AuthService) { }
  
  register(username: string, password: string) {
    //console.log("register ", {username, password});
    return this.http.post<any>(`http://localhost:3030/user/register`, {username, password});
  }

  getstats() {
    //return this.http.get<[]>(`http://localhost:3030/user/getstats`, { headers: this.authService.httpHeader });
    return this.http.get<[]>(`http://localhost:3030/user/getstats`);
  }
}
