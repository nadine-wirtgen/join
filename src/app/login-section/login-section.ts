import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login-section.html',
  styleUrls: ['./login-section.scss'],
})
export class LoginSection implements OnInit {

  startAnimation = false;
  showSignupLink = true;

  constructor(private router: Router) {}

  ngOnInit() {
  
    setTimeout(() => {
      this.startAnimation = true;
    }, 1000);

    // 🔹 Sichtbarkeit Signup-Link abhängig von Route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showSignupLink =
          event.urlAfterRedirects === '/login';
      });
  }
}
