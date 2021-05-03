import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { NotificationService } from './notification.service';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<any>;  // changed from Observable<User>


  private httpOptions;

  constructor(private http: HttpClient,
    private notifService: NotificationService,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));

    // currentUser is turned into an Observable that will allow other parts of the app to subscribe and get notified when currentUserSubject changes.
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.currentUserSubject.value) {
      this.httpOptions = {
        Authorization: 'Bearer ' + this.currentUserSubject.value.token
      };
    } else {
      this.httpOptions = {
        Authorization: ''
      };
    }

  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get httpHeader() {
    return {  Authorization: 'Bearer ' + this.currentUserValue.token  };
  }

  login(username: string, password: string): Observable<any> {
    // Read more here: https://angular.io/guide/http
    return this.http.post<any>(`http://localhost:3030/user/authenticate`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        this.notifService.showNotif(`Logged in as ${user.username}`, "(:");

        return user;
      }));
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');

    if (this.currentUserSubject.value) {
      this.notifService.showNotif(`Logged out`, "(:");
    }

    // notify all subscribers that user has logged out.
    this.currentUserSubject.next(null);
    this.currentUser = this.currentUserSubject.asObservable();

    this.router.navigate(['/']);
  }


}
