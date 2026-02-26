import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../firebase-service/auth.servic';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loginError = false;

  // 🔹 Passwort Sichtbarkeit
  passwordVisible: boolean = false;

  constructor(
    private auth: AuthService,
     private router: Router
  ) {}

  // 🔹 Login Methode
  async login() {
    const result = await this.auth.login(this.email, this.password);

    if (result.success) {
      this.loginError = false;
      this.router.navigate(['/summary']);
    } else {
      this.loginError = true;
    }
  }

  // 🔹 Guest Login
  async guestLogin() {
    await this.auth.guestLogin();
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
