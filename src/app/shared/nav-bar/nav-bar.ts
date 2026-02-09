import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../firebase-service/auth.servic';
import { NavBarLoggedIn } from './nav-bar-logged-in/nav-bar-logged-in';
import { NavBarLoggedOut } from './nav-bar-logged-out/nav-bar-logged-out';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, AsyncPipe, NavBarLoggedIn, NavBarLoggedOut],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.scss'],
})
export class NavBar {
  private auth = inject(AuthService);
  isLoggedIn$ = this.auth.isLoggedIn$;
}
