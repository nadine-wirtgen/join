import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  inject,
  ViewChild,
  ViewChildren,
  Output,
  EventEmitter,
} from '@angular/core';
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
  imports: [ContactDialogTemplate],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList implements OnInit, OnDestroy {
  contactService = inject(ContactService);
  dialogMode: 'open' | 'change' = 'open';
  @Output() switch = new EventEmitter<void>();

  private editSubscription?: Subscription;
  @ViewChildren('contactRow') contactRows?: QueryList<ElementRef<HTMLElement>>;

  @ViewChild('contactDialog') contactDialog?: ContactDialogTemplate;

  constructor(/*public contactService: ContactService*/) {}

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
    this.openContact();
  }

  getInitials(name?: string): string {
    return this.contactService.getInitials(name);
  }

  getDisplayName(name?: string): string {
    if (!name) return '';
    return name.length >= 20 ? name.slice(0, 15) + '…' : name;
  }

  getContactColor(contact: Contacts): string {
    return this.contactService.getContactColor(contact);
  }

  handleContactCreated(contact: Contacts): void {
    this.contactService.setSelectedContact(contact);
    this.openContact();
    this.scrollToContact(contact.id);
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

  openContact() {
    this.switch.emit();
  }

  private scrollToContact(contactId?: string): void {
    if (!contactId || !this.contactRows) {
      return;
    }

    const tryScroll = () => {
      const target = this.contactRows?.find(
        (row) => row.nativeElement.dataset['contactId'] === contactId
      );
      if (target) {
        target.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return true;
      }
      return false;
    };

    if (tryScroll()) {
      return;
    }

    const changeSubscription = this.contactRows.changes.subscribe(() => {
      if (tryScroll()) {
        changeSubscription.unsubscribe();
      }
    });

    window.setTimeout(() => {
      if (!tryScroll()) {
        changeSubscription.unsubscribe();
      }
    }, 1000);
  }
}
