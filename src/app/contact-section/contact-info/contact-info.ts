import { Component, inject } from '@angular/core';
import { ContactService } from '../../firebase-service/contact-service';
import { Contacts } from '../../interfaces/contacts';

@Component({
  selector: 'app-contact-info',
  imports: [],
  templateUrl: './contact-info.html',
  styleUrl: './contact-info.scss',
})
export class ContactInfo {
  contactService = inject(ContactService);
  hoveredIcon: string | null = null;

  get selectedContact(): Contacts | null {
    return this.contactService.selectedContact;
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

  editContact(): void {
    if (this.selectedContact) {
      this.contactService.requestEdit();
    }
  }

  deleteContact(): void {
    this.contactService.deleteSelectedContact();
  }

  getSelectedColor(): string {
    return this.contactService.getContactColor(this.selectedContact);
  }
}
