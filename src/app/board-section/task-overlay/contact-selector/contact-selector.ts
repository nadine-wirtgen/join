import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contacts } from '../../../interfaces/contacts';
import { ContactService } from '../../../firebase-service/contact-service';

@Component({
  selector: 'app-contact-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-selector.html',
  styleUrls: ['./contact-selector.scss']
})
export class ContactSelector implements OnInit, OnChanges, OnDestroy {

  @Input() contacts: Contacts[] = [];
  @Input() selectedContactNames: string[] = [];
  @Output() selectedContactsChange = new EventEmitter<string[]>();

  selectedContacts: Contacts[] = [];
  showDropdown = false;
  searchTerm = '';
  private clickListener!: () => void;

  constructor(
    private contactService: ContactService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.syncSelectedContacts();

    // Dokumenten-Klicklistener
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.elRef.nativeElement.contains(event.target)) {
        this.showDropdown = false;
      }
    });
  }

  ngOnChanges() {
    this.syncSelectedContacts();
  }

  ngOnDestroy() {
    if (this.clickListener) this.clickListener();
  }

  private syncSelectedContacts() {
    if (!this.contacts || !this.selectedContactNames) return;
    this.selectedContacts = this.contacts.filter(c =>
      this.selectedContactNames.includes(c.name)
    );
  }

  toggleDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  get filteredContacts(): Contacts[] {
    if (!this.searchTerm) return this.contacts;
    return this.contacts.filter(c =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleContact(contact: Contacts) {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);
    if (index > -1) this.selectedContacts.splice(index, 1);
    else this.selectedContacts.push(contact);
    this.emitSelection();
  }

  isContactSelected(contact: Contacts): boolean {
    return this.selectedContacts.some(c => c.id === contact.id);
  }

  private emitSelection() {
    this.selectedContactsChange.emit(this.selectedContacts.map(c => c.name));
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts.length > 1 ? parts[1].charAt(0) : '';
    return (first + second).toUpperCase();
  }

  getContactColor(contact: Contacts): string {
    return this.contactService.getContactColor(contact);
  }
}