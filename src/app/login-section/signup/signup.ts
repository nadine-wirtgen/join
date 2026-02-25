import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {

  // 🔹 Form Fields
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptedPrivacy: boolean = false;

  // 🔹 UI States
  isLoading: boolean = false;
  signupSuccess: boolean = false;

  // 🔹 Focus States für Fehleranzeige
  nameFocused: boolean = false;
  emailFocused: boolean = false;
  passwordFocused: boolean = false;
  confirmFocused: boolean = false;

  // 🔹 Passwort Sichtbarkeit
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  // 🔹 Regex für sicheres Passwort
  securePasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  constructor(private router: Router) {}

  // 🔹 Prüfen ob Passwort sicher ist
  get isPasswordSecure(): boolean {
    return this.securePasswordRegex.test(this.password);
  }

  // 🔹 Prüfen ob Passwörter nicht übereinstimmen
  get passwordMismatch(): boolean {
    return (
      this.confirmPassword.length > 0 &&
      this.password !== this.confirmPassword
    );
  }

  // 🔹 Gesamte Formularvalidierung für Sign-Up Button
  isFormValid(): boolean {
    const nameValid = this.name.trim().length >= 5;
    const emailValid =
      /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(this.email);
    const passwordValid = this.isPasswordSecure;
    const confirmValid =
      this.confirmPassword.length > 0 &&
      this.password === this.confirmPassword;

    return (
      nameValid &&
      emailValid &&
      passwordValid &&
      confirmValid &&
      this.acceptedPrivacy
    );
  }

  // 🔹 Toggle Passwort Sichtbarkeit
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // 🔹 Signup Methode
  signup(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.signupSuccess = false;

    setTimeout(() => {
      this.isLoading = false;
      this.signupSuccess = true;

      // 🔹 Overlay nach 3 Sekunden automatisch wieder ausblenden
      setTimeout(() => {
        this.signupSuccess = false;
        this.router.navigate(['/login']);
      }, 3000);

    }, 800);
  }
}