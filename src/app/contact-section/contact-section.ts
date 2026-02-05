import { Component, HostListener } from '@angular/core';
import { ContactInfo } from './contact-info/contact-info';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'app-contact-section',
  imports: [ContactList, ContactInfo],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {
  isMobile = window.innerWidth <= 768;
  showList = true;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showList = true;
    }
  }

  switchView() {
    if (this.isMobile) {
      this.showList = !this.showList;
    }
  }
}
