import { Auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {
    this.loggedInSubject.next(false);
  }
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();



  /**
   * Komplettes Signup inkl. Profilname setzen und Fehlerbehandlung
   */
  async signup(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Login mit Firebase Authentication
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      this.loggedInSubject.next(true);
      return { success: true };
    } catch (error: any) {
      this.loggedInSubject.next(false);
      return { success: false, error: error.message };
    }
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
