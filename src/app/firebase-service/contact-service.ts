import { inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import {
  Firestore,
  collection,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot
} from '@angular/fire/firestore';
import { Contacts } from '../interfaces/contacts';

/**
 * Service for managing contacts in Firestore.
 */
@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnDestroy {
  unsubscribe;
  firebaseDB: Firestore = inject(Firestore);
  contactList: Contacts[] = [];
  selectedContact: Contacts | null = null;
  editRequest$ = new Subject<void>();
  private readonly colorPalette = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B',
  ];
  private contactColorMap = new Map<string, string>();
  //contacts$;

  constructor() {
    this.unsubscribe = onSnapshot(
      collection(this.firebaseDB, 'contacts'),
      (contactsListObject) => {
        this.contactList = [];
        contactsListObject.forEach((docObject) => {
          this.contactList.push(
            this.getContactsObject(docObject.id, docObject.data() as Contacts)
          );
        });
        this.rebuildColorMap();
      }
    );
  }

  /**
   * Adds a contact to the Firestore database.
   * @param contact The contact to add.
   * @returns The created contact or null if failed.
   */
  async addContactToDataBase(contact: Contacts): Promise<Contacts | null> {
    try {
      const docRef = await addDoc(collection(this.firebaseDB, 'contacts'), contact);
      const createdContact = {
        id: docRef.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      };
      this.selectedContact = createdContact;
      return createdContact;
    } catch (error) {
      console.error('Error adding contact: ', error);
      return null;
    }
  }

  /**
   * Deletes a contact from the Firestore database.
   * @param vocabulary The contact to delete.
   */
  async deleteContactOnDatabase(vocabulary: Contacts) {
    if (vocabulary.id) {
      await deleteDoc(
        doc(this.firebaseDB, 'contacts', vocabulary.id)
      );
    }
  }

  /**
   * Updates a contact in the Firestore database.
   * @param contact The contact to update.
   */
  async updateContact(contact: Contacts) {
    if (!contact.id) {
      return;
    }

    try {
      const docRef = this.getSingleDoc('contacts', contact.id);
      await updateDoc(docRef, this.getCleanJson(contact));
      if (this.selectedContact?.id === contact.id) {
        this.selectedContact = {
          ...this.selectedContact,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
        };
      }
    } catch (error) {
      console.error('Fehler beim Update Contact:', error);
    }
  }

  /**
   * Returns a plain object with only the contact's fields.
   * @param contact The contact.
   */
  getCleanJson(contact: Contacts): {} {
    return {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
  }

  /**
   * Sets the currently selected contact.
   * @param contact The contact to select.
   */
  setSelectedContact(contact: Contacts): void {
    this.selectedContact = contact;
  }

  /**
   * Emits an edit request event.
   */
  requestEdit(): void {
    this.editRequest$.next();
  }

  /**
   * Gets the color for a contact.
   * @param contact The contact.
   * @returns The color string.
   */
  getContactColor(contact: Contacts | null | undefined): string {
    if (!contact) {
      return this.colorPalette[0];
    }

    const key = this.getContactKey(contact);
    return this.contactColorMap.get(key) ?? this.colorPalette[0];
  }

  /**
   * Gets the initials for a contact name.
   * @param name The contact name.
   * @returns The initials string.
   */
  getInitials(name?: string): string {
    if (!name?.trim()) {
      return '';
    }
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  /**
   * Deletes a contact by index from the contact list.
   * @param index The index of the contact.
   */
  deleteContact(index: number) {
    const vocable = this.contactList[index];
    this.deleteContactOnDatabase(vocable);
  }

  /**
   * Deletes the currently selected contact.
   */
  deleteSelectedContact(): void {
    if (!this.selectedContact) {
      return;
    }

    this.deleteContactOnDatabase(this.selectedContact);
    this.selectedContact = null;
  }

  /**
   * Angular lifecycle: cleans up Firestore subscription.
   */
  ngOnDestroy() {
    this.unsubscribe();
  }

  /**
   * Gets the Firestore collection reference for contacts.
   */
  getContactsRef() {
    return collection(this.firebaseDB, 'contacts');
  }

  /**
   * Returns a Contacts object with the given id and data.
   * @param id The contact id.
   * @param obj The contact data.
   * @returns The Contacts object.
   */
  getContactsObject(
    id: string,
    obj: Contacts,
  ): Contacts{
    return {
      id: id,
      name: obj.name,
      email: obj.email,
      phone: obj.phone,
    }
  }

  /**
   * Gets a Firestore document reference for a single contact.
   * @param colId The collection id.
   * @param docId The document id.
   */
  getSingleDoc(colId: string, docId: string) {
    return doc(collection(this.firebaseDB, colId), docId);
  }

  /**
   * Rebuilds the color map for all contacts.
   */
  private rebuildColorMap(): void {
    const sorted = [...this.contactList].sort((a, b) =>
      a.name.localeCompare(b.name, 'de', { sensitivity: 'base' })
    );

    this.contactColorMap.clear();
    sorted.forEach((contact, index) => {
      const key = this.getContactKey(contact);
      const color = this.colorPalette[index % this.colorPalette.length];
      this.contactColorMap.set(key, color);
    });
  }

  /**
   * Gets a unique key for a contact.
   * @param contact The contact.
   * @returns The key string.
   */
  private getContactKey(contact: Contacts): string {
    return contact.id ?? `${contact.name}|${contact.email}`;
  }
}
