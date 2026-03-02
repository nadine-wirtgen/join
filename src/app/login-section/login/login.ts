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
export class Login {
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
    try {
      const result = await this.auth.login(this.email, this.password);

      if (result.success) {
        this.loginError = false;

        const foundContact = this.contactService.contactList.find(
          (contact) => contact.email === this.email,
        );

        if (foundContact) {
          this.contactService.setCurrentUser(foundContact.name, foundContact.email);
        } else {
          console.warn('No contact found with this email');
        }

        await this.router.navigate(['/summary'], {
          state: { fromLogin: true },
        });
      } else {
        this.loginError = true;
      }
    } catch (error) {
      console.error('Login error:', error);
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