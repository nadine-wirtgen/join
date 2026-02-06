import { Component, inject, Output, EventEmitter, HostListener } from '@angular/core';
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
  @Output() switch = new EventEmitter<void>();
  hoveredIcon: string | null = null;
  menuOpen = false;
  isActive = false;

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
    this.switch.emit();
  }

  getSelectedColor(): string {
    return this.contactService.getContactColor(this.selectedContact);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('click')
  onComponentClick() {
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }

  onEditFromMenu(event: Event) {
    event.stopPropagation();
    this.switch.emit();
    setTimeout(() => this.editContact());
    this.menuOpen = false;
  }

  onDeleteFromMenu(event: Event) {
    event.stopPropagation();
    this.deleteContact();
    this.menuOpen = false;
  }

  backToList() {
    this.isActive = true;

    setTimeout(() => {
      this.switch.emit();
      this.isActive = false;
    }, 500);
  }
}
