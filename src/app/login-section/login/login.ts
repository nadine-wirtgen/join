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
  passwordVisible: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private contactService: ContactService,
  ) {}

  // 🔹 Login Methode
  async login() {
    try {
      const result = await this.auth.login(this.email, this.password);

      if (result.success) {
        this.loginError = false;

        // 🔎 Kontakt anhand der Email suchen
        const foundContact = this.contactService.contactList.find(
          (contact) => contact.email === this.email,
        );

        if (foundContact) {
          // ✅ User global speichern
          this.contactService.setCurrentUser(foundContact.name, foundContact.email);

          console.log('Aktueller User:', foundContact.name);
        } else {
          console.warn('Kein Kontakt mit dieser Email gefunden');
        }

        // ✅ Navigation zur Summary
        this.router.navigate(['/summary'], {
          state: { fromLogin: true },
        });
      } else {
        this.loginError = true;
      }
    } catch (error) {
      console.error('Login Fehler:', error);
      this.loginError = true;
    }
  }

  // 🔹 Guest Login
  async guestLogin() {
    await this.auth.guestLogin();

    this.contactService.setCurrentUser('Guest', 'guest@local');

    this.router.navigate(['/summary'], {
      state: { fromLogin: true, guest: true },
    });
  }

  // 🔹 Fehlermeldung zurücksetzen
  clearLoginError() {
    if (this.loginError) {
      this.loginError = false;
    }
  }

  // 🔹 Toggle Passwort Sichtbarkeit
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
