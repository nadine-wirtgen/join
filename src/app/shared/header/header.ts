import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common'; // <- NgIf hinzufügen
import { AuthService } from '../../firebase-service/auth.servic';
import { HeaderLoggedIn } from './header-logged-in/header-logged-in';
import { HeaderLoggedOut } from './header-logged-out/header-logged-out';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, AsyncPipe, HeaderLoggedIn, HeaderLoggedOut], // <- NgIf hier
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  private auth = inject(AuthService);
  isLoggedIn$ = this.auth.isLoggedIn$;
}