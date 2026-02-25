import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    this.loggedInSubject.next(false);
  }

  // 🔹 Login als Promise
  login(email: string, password: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        // Demo: nur fester User
        if (email === 'demo@test.com' && password === '1234') {
          this.loggedInSubject.next(true);
          resolve(true);
        } else {
          this.loggedInSubject.next(false);
          resolve(false);
        }
      }, 200); // kleine Verzögerung simuliert echten Login
    });
  }

  // 🔹 Gast-Login
  guestLogin(): Promise<void> {
    return new Promise(resolve => {
      this.loggedInSubject.next(true);
      resolve();
    });
  }

  logout() {
    this.loggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
