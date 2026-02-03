import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  firestore: Firestore = inject(Firestore);
  contacts$;

  constructor() {
    this.contacts$ = collectionData(this.getContactsRef(), {
      idField: 'id',
    });
  }


  getContactsRef() {
    return collection(this.firestore, 'contacts');
  }

  getSingleDoc(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
