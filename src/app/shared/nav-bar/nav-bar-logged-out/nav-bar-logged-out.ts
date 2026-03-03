import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

/**
 * Standalone navigation bar component for users who are not logged in.
 *
 * Responsibilities:
 * - Displays the logo, main login link, and footer links (Legal & Privacy).
 * - Supports both desktop and mobile layouts.
 * - Ensures the login animation state is tracked in sessionStorage.
 * - Provides a method to navigate programmatically via footer div buttons.
 */
@Component({
  selector: 'app-nav-bar-logged-out',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar-logged-out.html',
  styleUrls: ['./nav-bar-logged-out.scss'],
})
export class NavBarLoggedOut implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('loginAnimationPlayed')) {
      sessionStorage.setItem('loginAnimationPlayed', 'false');
    }
  }

  /**
   * Programmatically navigates to the provided URL.
   * Can be used with div elements styled as buttons in the footer.
   *
   * @param url - The route path to navigate to (e.g., '/login' or '/privacy')
   */
  navigate(url: string): void {
    this.router.navigate([url]);
  }
}