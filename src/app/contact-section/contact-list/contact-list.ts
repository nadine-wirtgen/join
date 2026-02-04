
import { Component, OnDestroy, OnInit, inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
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
export class ContactList implements OnInit, OnDestroy {
  contactService = inject(ContactService);
  dialogMode: 'open' | 'change' = 'open';

  private editSubscription?: Subscription;

  @ViewChild('contactDialog') contactDialog?: ContactDialogTemplate;

  
  constructor(/*public contactService: ContactService*/) {

  }

  ngOnInit(): void {
    this.editSubscription = this.contactService.editRequest$.subscribe(() => {
      this.openContactDia('change');
    });
  }

  ngOnDestroy(): void {
    this.editSubscription?.unsubscribe();
  }

  openContactDia(action: 'open' | 'change') {
    this.dialogMode = action;
    this.contactDialog?.openWithMode(action);
  }

  selectContact(contact: Contacts): void {
    this.contactService.setSelectedContact(contact);
  }

  getInitials(name?: string): string {
    if (!name?.trim()) {
      return '';
    }

    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  getContactColor(contact: Contacts): string {
    return this.contactService.getContactColor(contact);
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
