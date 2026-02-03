import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../firebase-service/contact-service';

type DialogMode = 'open' | 'change';
type DialogTextKey = 'title' | 'subtitle' | 'primaryAction' | 'secondaryAction';

@Component({
  selector: 'app-contact-dialog-template',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-dialog-template.html',
  styleUrl: './contact-dialog-template.scss',
})
export class ContactDialogTemplate {
  contactsService = inject(ContactService);
  @Input() mode: DialogMode = 'open';
  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;

  dialogText: Record<DialogMode, Record<DialogTextKey, string>> = {
    open: {
      title: 'Add contact',
      subtitle: 'Tasks are better with a team!',
      primaryAction: 'Create Contact',
      secondaryAction: 'Cancel',
    },
    change: {
      title: 'Edit contact',
      subtitle: '',
      primaryAction: 'Save',
      secondaryAction: 'Delete',
    },
  };

  contact = {
    name: '',
    email: '',
    phone: '',
  };

  open(): void {
    this.dialog?.nativeElement.showModal();
  }

  close(): void {
    this.dialog?.nativeElement.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog?.nativeElement) {
      this.close();
    }
  }

  getText(key: DialogTextKey): string {
    return this.dialogText[this.mode][key];
  }

  handlePrimaryAction(): void {
    if (this.mode === 'open') {
      this.submitContact();
      return;
    }

    // TODO: handle save changes later
  }

  handleSecondaryAction(): void {
    if (this.mode === 'open') {
      this.close();
      return;
    }

    // TODO: handle delete later
  }

  submitContact(): void {
    this.contactsService.addContactToDataBase(this.contact);
    this.clearInputFields();
  }

  clearInputFields(): void {
    this.contact.name = '';
    this.contact.email = '';
    this.contact.phone = '';
  }
}
