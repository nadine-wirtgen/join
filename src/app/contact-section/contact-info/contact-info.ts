import { Component, inject, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { ContactService } from '../../firebase-service/contact-service';
import { Contacts } from '../../interfaces/contacts';
import { ContactDialogTemplate } from '../contact-dialog-template/contact-dialog-template';

@Component({
  selector: 'app-contact-info',
  imports: [ContactDialogTemplate],
  templateUrl: './contact-info.html',
  styleUrl: './contact-info.scss',
})
export class ContactInfo {
  contactService = inject(ContactService);
  @Output() switch = new EventEmitter<void>();
  @ViewChild('contactDialog') contactDialog?: ContactDialogTemplate;
  hoveredIcon: string | null = null;
  menuOpen = false;

  get selectedContact(): Contacts | null {
    return this.contactService.selectedContact;
  }

  editContact(): void {
    if (this.selectedContact) {
      this.contactDialog?.openWithMode('change');
    }
  }

  deleteContact(): void {
    this.contactService.deleteSelectedContact();
    this.switch.emit();
  }

  getSelectedColor(): string {
    return this.contactService.getContactColor(this.selectedContact);
  }

  getInitials(name?: string): string {
    return this.contactService.getInitials(name);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onComponentClick(event: MouseEvent) {
    if ((event.target as HTMLElement)?.closest('app-contact-info')) {
      return;
    }
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  onEditFromMenu(event: Event) {
    event.stopPropagation();
    this.editContact();
    this.menuOpen = false;
  }

  onDeleteFromMenu(event: Event) {
    event.stopPropagation();
    this.deleteContact();
    this.menuOpen = false;
  }

  backToList() {
    this.switch.emit();
  }
}
