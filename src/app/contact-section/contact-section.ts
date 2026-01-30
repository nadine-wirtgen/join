import { Component } from '@angular/core';
import { ContactList } from './contact-list/contact-list';
import { ContactInfo } from './contact-info/contact-info';

@Component({
  selector: 'app-contact-section',
  imports: [ContactList, ContactInfo],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection {

}
