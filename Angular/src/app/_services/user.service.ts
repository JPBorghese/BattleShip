
import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';



@Injectable({ providedIn: 'root' })
export class UserService {


  constructor(private http: HttpClient) { }

  // getAll() {
  //    return this.http.get<User[]>(`http://localhost:3030/user/allusers`);
  // }

  
  register(username: string, password: string) {
    //console.log("register ", {username, password});
    return this.http.post<any>(`http://localhost:3030/user/register`, {username, password});
  }

  getstats() {
    return this.http.get<[]>(`http://localhost:3030/user/getstats`);
  }
}
