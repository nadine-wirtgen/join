import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-logged-out',
  standalone: true,
  templateUrl: './header-logged-out.html',
  styleUrls: ['./header-logged-out.scss'],
})
export class HeaderLoggedOut {
  @Input() appTitle: string = 'Kanban Project Management Tool';
  logoPath: string = 'assets/icon/header/logo_grey.png';
}