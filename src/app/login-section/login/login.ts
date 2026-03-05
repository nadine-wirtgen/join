import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../firebase-service/auth.servic';
import { ContactService } from '../../firebase-service/contact-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loginError = false;
  passwordVisible = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private contactService: ContactService,
  ) {}

  /**
   * Authenticates the user with email and password.
   * On success, loads the corresponding contact and navigates to the summary page.
   */
  async login() {
    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      this.loginError = true;
      return;
    }

    try {
      const result = await this.auth.login(trimmedEmail, trimmedPassword);

      if (result.success) {
        this.loginError = false;
        const foundContact = this.contactService.contactList.find(
          (contact) => contact.email === trimmedEmail,
        );

        const firebaseUser = this.auth.getCurrentUser();

        const resolvedName =
          foundContact?.name ||
          firebaseUser?.displayName ||
          firebaseUser?.email ||
          trimmedEmail;

        const resolvedEmail =
          foundContact?.email ||
          firebaseUser?.email ||
          trimmedEmail;

        this.contactService.setCurrentUser(resolvedName, resolvedEmail);

        await this.router.navigate(['/summary'], {
          state: { fromLogin: true },
        });
      } else {
        this.loginError = true;
      }
    } catch (error) {
      
      this.loginError = true;
    }
  }

  /**
   * Logs in the user as a guest and navigates to the summary page.
   */
  async guestLogin() {
    await this.auth.guestLogin();
    this.contactService.setCurrentUser('Guest', 'guest@local');
    await this.router.navigate(['/summary'], {
      state: { fromLogin: true, guest: true },
    });
  }

  /**
   * Resets the login error flag when the user modifies the input fields.
   */
  clearLoginError() {
    if (this.loginError) {
      this.loginError = false;
    }
  }

  /**
   * Toggles the visibility of the password field.
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}