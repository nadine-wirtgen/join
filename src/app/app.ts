import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { ContactSection } from './contact-section/contact-section';
import { NavBar } from './shared/nav-bar/nav-bar';
import { HelpSection } from './help-section/help-section';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NavBar, ContactSection, HelpSection],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('join');
}
