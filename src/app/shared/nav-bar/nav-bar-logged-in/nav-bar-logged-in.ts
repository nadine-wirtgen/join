import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar-logged-in',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar-logged-in.html',
  styleUrls: ['./nav-bar-logged-in.scss'],
})
export class NavBarLoggedIn {}
