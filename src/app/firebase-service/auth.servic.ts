import { Auth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();



  /**
   * Komplettes Signup inkl. Profilname setzen und Fehlerbehandlung
   */
  /**
   * Registers a new user with email, password, and display name.
   * @param email The user's email address.
   * @param password The user's password.
   * @param name The user's display name.
   * @returns Promise resolving to success or error message.
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
  /**
   * Logs in a user with email and password using Firebase Authentication.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns Promise resolving to success or error message.
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

  
  /**
   * Simulates a guest login by setting the logged-in state to true.
   * @returns Promise that resolves when login is simulated.
   */
  guestLogin(): Promise<void> {
    return new Promise(resolve => {
      this.loggedInSubject.next(true);
      resolve();
    });
  }

  /**
   * Logs out the user by setting the logged-in state to false.
   */
  logout() {
    this.loggedInSubject.next(false);
  }

  /**
   * Returns whether the user is currently logged in.
   * @returns True if logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}
