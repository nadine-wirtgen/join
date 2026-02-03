import { Component } from '@angular/core';
import { ContactInfo } from './contact-info/contact-info';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'app-contact-section',
  imports: [ContactList, ContactInfo],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {

}
