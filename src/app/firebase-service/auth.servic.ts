import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedInSubject.asObservable();
    constructor() {
    this.loggedInSubject.next(false);
  }

  login() {
    this.loggedInSubject.next(true);
  }

  logout() {
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
