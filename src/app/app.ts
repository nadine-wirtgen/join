import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';

import { NavBar } from './shared/nav-bar/nav-bar';

import { ContactService } from './firebase-service/contact-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('join');
  contactsService = inject(ContactService);
}
