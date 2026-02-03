
import { Component, inject, ViewChild } from '@angular/core';
import { ContactDialogTemplate } from '../contact-dialog-template/contact-dialog-template';
import { ContactService } from '../../firebase-service/contact-service';
import { Contacts } from '../../interfaces/contacts';

type ContactGroup = {
  letter: string;
  contacts: Contacts[];
};

@Component({
  selector: 'app-contact-list',
  imports: [ ContactDialogTemplate],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {
  contactService = inject(ContactService);
  dialogMode: 'open' | 'change' = 'open';

  @ViewChild('contactDialog') contactDialog?: ContactDialogTemplate;

  
  constructor(/*public contactService: ContactService*/) {

  }

  openContactDia(action: 'open' | 'change') {
    this.dialogMode = action;
    this.contactDialog?.open();
  }

  getContactGroups(): ContactGroup[] {
    const contacts = [...this.contactService.contactList]
      .filter((contact) => contact.name?.trim())
      .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));

    const groups: ContactGroup[] = [];

    for (const contact of contacts) {
      const letter = contact.name.trim().charAt(0).toUpperCase();
      const lastGroup = groups[groups.length - 1];

      if (!lastGroup || lastGroup.letter !== letter) {
        groups.push({ letter, contacts: [contact] });
      } else {
        lastGroup.contacts.push(contact);
      }
    }

    return groups;
  }
}
