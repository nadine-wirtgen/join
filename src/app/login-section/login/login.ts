import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../firebase-service/auth.servic';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.auth.login(); // fake
    this.router.navigate(['/summary']);
  }

  guestLogin() {
    this.auth.login(); // fake
    this.router.navigate(['/summary']);
  }
}
