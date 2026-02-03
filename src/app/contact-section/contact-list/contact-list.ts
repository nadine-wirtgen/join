import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ContactDialogTemplate } from '../contact-dialog-template/contact-dialog-template';
import { ContactService } from '../../firebase-service/contact-service';

@Component({
  selector: 'app-contact-list',
  imports: [AsyncPipe, ContactDialogTemplate],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {
  dialogMode: 'open' | 'change' = 'open';

  @ViewChild('contactDialog') contactDialog?: ContactDialogTemplate;

  
  constructor(public contactService: ContactService) {

  }

  openContactDia(action: 'open' | 'change') {
    this.dialogMode = action;
    this.contactDialog?.open();
  }
}
