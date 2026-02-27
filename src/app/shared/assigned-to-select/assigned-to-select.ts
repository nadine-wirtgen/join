import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contacts } from '../../interfaces/contacts';
import { ContactService } from '../../firebase-service/contact-service';

@Component({
  selector: 'app-assigned-to-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned-to-select.html',
  styleUrls: ['./assigned-to-select.scss']
})
export class AssignedToSelectComponent implements OnInit, OnDestroy, OnChanges {

  @Input() contacts: Contacts[] = [];
  @Input() selectedContacts: Contacts[] = [];
  @Output() selectedContactsChange = new EventEmitter<Contacts[]>();

  isDropdownOpen = false;
  contactSearchTerm = '';

  private clickListener!: () => void;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private contactService: ContactService
  ) {}

  /** 
   * Initializes click listener for closing dropdown when clicking outside.
   */
  ngOnInit() {
    this.clickListener = this.renderer.listen(
      'document',
      'click',
      (event: MouseEvent) => this.handleDocumentClick(event)
    );
  }

  /**
   * Handles changes to inputs.
   * @param changes SimpleChanges object
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedContacts']) {
      this.selectedContacts = [...this.selectedContacts];
    }
  }

  /**
   * Cleanup listener on destroy.
   */
  ngOnDestroy() {
    if (this.clickListener) this.clickListener();
  }

  /** Toggle dropdown open/close */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /** Open the dropdown */
  openDropdown() {
    this.isDropdownOpen = true;
  }

  /**
   * Handle document click to close dropdown if clicked outside.
   * @param event MouseEvent
   */
  private handleDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  /**
   * Handles input change in search field.
   * @param event Input event
   */
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.contactSearchTerm = input.value;
    this.openDropdown();
  }

  /**
   * Toggles contact selection.
   * @param contact Contact to toggle
   */
  toggleContact(contact: Contacts) {
    const updated = this.getUpdatedContacts(contact);
    this.selectedContacts = updated;
    this.selectedContactsChange.emit(updated);
  }

  /**
   * Returns updated contacts after toggle.
   * @param contact Contact to toggle
   * @returns Updated Contacts array
   */
  private getUpdatedContacts(contact: Contacts): Contacts[] {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);
    if (index > -1) {
      return this.selectedContacts.filter(c => c.id !== contact.id);
    }
    return [...this.selectedContacts, contact];
  }

  /**
   * Checks if a contact is selected.
   * @param contact Contact
   * @returns boolean
   */
  isSelected(contact: Contacts) {
    return this.selectedContacts.some(c => c.id === contact.id);
  }

  /**
   * Filters contacts by search term and sorts them alphabetically.
   * @returns filtered and sorted contacts
   */
  filteredContacts(): Contacts[] {
    return this.contacts
      .filter(c => c.name.toLowerCase().includes(this.contactSearchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Returns initials for a contact name.
   * @param name Contact name
   * @returns Initials string
   */
  getInitials(name?: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  /**
   * Checks if contact is the current user.
   * @param contact Contact
   * @returns boolean
   */
  isCurrentUser(contact: Contacts): boolean {
    return contact.name === this.contactService.currentUserName;
  }

  /**
   * Returns color for a contact.
   * @param contact Contact
   * @returns color string
   */
  getContactColor(contact: Contacts): string {
    if (this.isCurrentUser(contact)) return '#4caf50';
    return this.contactService.getContactColor(contact);
  }
}