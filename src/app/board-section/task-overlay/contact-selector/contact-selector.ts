import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../firebase-service/contact-service';
import { Contacts } from '../../../interfaces/contacts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-selector.html',
  styleUrls: ['./contact-selector.scss'],
})
export class ContactSelector implements OnInit, OnDestroy {
  @Input() selectedContactNames: string[] = [];
  @Output() selectedContactsChange = new EventEmitter<Contacts[]>();

  allContacts: Contacts[] = [];
  selectedContacts: Contacts[] = [];
  showDropdown = false;
  searchTerm = '';
  showAllContacts = false;

  private contactListSubscription: Subscription | null = null;

  constructor(public contactService: ContactService) {}

  ngOnInit() {
    this.allContacts = [...this.contactService.contactList];
    this.updateSelectedContacts();

    this.contactListSubscription = this.contactService.editRequest$.subscribe(() => {
      this.allContacts = [...this.contactService.contactList];
      this.updateSelectedContacts();
    });
  }

  ngOnDestroy() {
    this.contactListSubscription?.unsubscribe();
  }

  get filteredContacts() {
    return this.allContacts.filter((contact) =>
      contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  get displayedSelectedContacts() {
    if (this.showAllContacts) {
      return this.selectedContacts;
    } else {
      return this.selectedContacts.slice(0, 3);
    }
  }

  get hiddenContactsCount() {
    if (this.selectedContacts.length <= 3) {
      return 0;
    }
    return this.selectedContacts.length - 3;
  }

  private updateSelectedContacts() {
    this.selectedContacts = this.allContacts.filter((contact) =>
      this.selectedContactNames.includes(contact.name),
    );
  }

  toggleContact(contact: Contacts) {
    const index = this.selectedContacts.findIndex((c) => c.id === contact.id);

    if (index === -1) {
      this.selectedContacts.push(contact);
      if (contact.id) {
        this.selectedContactNames = [...this.selectedContactNames, contact.id];
      }
    } else {
      this.selectedContacts.splice(index, 1);
      if (contact.id) {
        this.selectedContactNames = this.selectedContactNames.filter((id) => id !== contact.id);
      }
    }

    this.selectedContactsChange.emit(this.selectedContacts);
    this.searchTerm = '';
  }

  addContact(contact: Contacts) {
    this.toggleContact(contact);
  }

  removeContact(contact: Contacts) {
    if (contact.name) {
      this.selectedContactNames = this.selectedContactNames.filter((name) => name !== contact.name);
      this.updateSelectedContacts();
      this.selectedContactsChange.emit(this.selectedContacts);

      if (this.selectedContacts.length <= 3) {
        this.showAllContacts = false;
      }
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.searchTerm = '';
    }
  }

  toggleShowAll() {
    this.showAllContacts = !this.showAllContacts;
  }

  getInitials(name: string): string {
    return this.contactService.getInitials(name);
  }

  getContactColor(contact: Contacts): string {
    return this.contactService.getContactColor(contact);
  }

  getDisplayName(name: string): string {
    if (!name) return '';
    return name.length >= 20 ? name.slice(0, 15) + '…' : name;
  }

  @Input() showAsList: boolean = true;
  @Input() showCheckboxes: boolean = false;

  isContactSelected(contact: any): boolean {
    return this.selectedContacts.some((c) => c.name === contact.name);
  }
}
