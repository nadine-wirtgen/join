import { inject, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
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

  setSelectedContact(contact: Contacts): void {
    this.selectedContact = contact;
  }

  requestEdit(): void {
    this.editRequest$.next();
  }

  async deleteContactOnDatabase(vocabulary: Contacts) {
    if (vocabulary.id) {
      await deleteDoc(
        doc(this.firebaseDB, 'vocabulary', vocabulary.id)
      );
    }
  }

  deleteContact(index: number) {
    const vocable = this.contactList[index];
    this.deleteContactOnDatabase(vocable);
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
}
