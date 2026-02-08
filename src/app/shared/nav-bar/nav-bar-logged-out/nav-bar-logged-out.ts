import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar-logged-out',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar-logged-out.html',
  styleUrls: ['./nav-bar-logged-out.scss'],
})
export class NavBarLoggedOut {}
