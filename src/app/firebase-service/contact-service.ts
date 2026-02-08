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

  async addContactToDataBase(contact: Contacts) {
    try {
      await addDoc(collection(this.firebaseDB, 'contacts'), contact);
      console.log('Contact added successfully');
    } catch (error) {
      console.error('Error adding contact: ', error);
    }
  }

  async deleteContactOnDatabase(vocabulary: Contacts) {
    if (vocabulary.id) {
      await deleteDoc(
        doc(this.firebaseDB, 'contacts', vocabulary.id)
      );
    }
  }

  async updateContact(contact: Contacts) {
    if (!contact.id) {
      console.error('Kein contact.id vorhanden');
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
      console.log('Contact erfolgreich aktualisiert');
    } catch (error) {
      console.error('Fehler beim Update Contact:', error);
    }
  }

  getCleanJson(contact: Contacts): {} {
    return {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
  }

  setSelectedContact(contact: Contacts): void {
    this.selectedContact = contact;
  }

  requestEdit(): void {
    this.editRequest$.next();
  }

  getContactColor(contact: Contacts | null | undefined): string {
    if (!contact) {
      return this.colorPalette[0];
    }

    const key = this.getContactKey(contact);
    return this.contactColorMap.get(key) ?? this.colorPalette[0];
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

  deleteContact(index: number) {
    const vocable = this.contactList[index];
    this.deleteContactOnDatabase(vocable);
  }

  deleteSelectedContact(): void {
    if (!this.selectedContact) {
      return;
    }

    this.deleteContactOnDatabase(this.selectedContact);
    this.selectedContact = null;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  getContactsRef() {
    return collection(this.firebaseDB, 'contacts');
  }

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

  getSingleDoc(colId: string, docId: string) {
    return doc(collection(this.firebaseDB, colId), docId);
  }

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

  private getContactKey(contact: Contacts): string {
    return contact.id ?? `${contact.name}|${contact.email}`;
  }
}
