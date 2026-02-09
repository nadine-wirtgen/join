import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Header } from '../../shared/header/header';
import { NavBar } from '../../shared/nav-bar/nav-bar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,      // router-outlet
    NavBar,  // <app-sidebar>
    Header,   // <app-header>
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {}