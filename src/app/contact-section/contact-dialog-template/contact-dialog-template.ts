import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../firebase-service/contact-service';
import { Contacts } from '../../interfaces/contacts';

type DialogMode = 'open' | 'change';
type DialogTextKey = 'title' | 'subtitle' | 'primaryAction' | 'secondaryAction';

@Component({
  selector: 'app-contact-dialog-template',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-dialog-template.html',
  styleUrl: './contact-dialog-template.scss',
})
export class ContactDialogTemplate implements AfterViewInit, OnDestroy {
  contactsService = inject(ContactService);
  @Input() mode: DialogMode = 'open';
  @Output() contactCreated = new EventEmitter<Contacts>();
  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;
  private cancelListener?: (event: Event) => void;
  private readonly bodyScrollLockClass = 'dialog-scroll-lock';
  private readonly mobileBreakpoint = 1000;
  private isScrollLocked = false;
  private toastShowTimeoutId?: number;
  private toastHideTimeoutId?: number;
  showSuccessToast = false;

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

  openWithMode(mode: DialogMode): void {
    this.mode = mode;
    this.open();
  }

  ngAfterViewInit(): void {
    const dialogEl = this.dialog?.nativeElement;
    if (!dialogEl) {
      return;
    }

    this.cancelListener = event => {
      event.preventDefault();
      this.close();
    };

    dialogEl.addEventListener('cancel', this.cancelListener);
  }

  ngOnDestroy(): void {
    const dialogEl = this.dialog?.nativeElement;
    if (dialogEl && this.cancelListener) {
      dialogEl.removeEventListener('cancel', this.cancelListener);
    }
    this.unlockBodyScroll();
    this.clearToastTimeouts();
  }

  open(): void {
    if (this.mode === 'change') {
      const selected = this.contactsService.selectedContact;
      if (selected) {
        this.contact.name = selected.name ?? '';
        this.contact.email = selected.email ?? '';
        this.contact.phone = selected.phone?.toString() ?? '';
      }
    } else {
      this.clearInputFields();
    }

    const dialogEl = this.dialog?.nativeElement;
    if (!dialogEl) {
      return;
    }

    dialogEl.removeAttribute('data-dialog-state');
    this.lockBodyScroll();
    dialogEl.showModal();
  }

  close(): void {
    const dialogEl = this.dialog?.nativeElement;
    if (!dialogEl) {
      return;
    }

    const finishClose = () => {
      dialogEl.removeAttribute('data-dialog-state');
      dialogEl.close();
      this.unlockBodyScroll();
    };

    if (!dialogEl.open) {
      finishClose();
      return;
    }

    if (dialogEl.getAttribute('data-dialog-state') === 'closing') {
      return;
    }

    const animationDuration = 400;
    let fallbackId: number | undefined;

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.target !== dialogEl) {
        return;
      }
      if (event.animationName !== 'dialog-exit-right' && event.animationName !== 'dialog-exit-up') {
        return;
      }

      if (fallbackId !== undefined) {
        window.clearTimeout(fallbackId);
      }
      dialogEl.removeEventListener('animationend', handleAnimationEnd);
      finishClose();
    };

    fallbackId = window.setTimeout(() => {
      dialogEl.removeEventListener('animationend', handleAnimationEnd);
      finishClose();
    }, animationDuration);

    dialogEl.addEventListener('animationend', handleAnimationEnd);
    dialogEl.setAttribute('data-dialog-state', 'closing');
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog?.nativeElement) {
      this.close();
    }
  }

  getText(key: DialogTextKey): string {
    return this.dialogText[this.mode][key];
  }

  getContactColor(contact: any): string {
    return this.contactsService.getContactColor(contact);
  }

  handlePrimaryAction(form: NgForm): void {
    if (!form.valid) {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
      return;
    }
    if (this.mode === 'open') {
      this.submitContact(form);
      return;
    }

    this.saveChanges();
  }

  async saveChanges(): Promise<void> {
    const selected = this.contactsService.selectedContact;
    if (!selected?.id) {
      return;
    }

    await this.contactsService.updateContact({
      id: selected.id,
      name: this.contact.name,
      email: this.contact.email,
      phone: this.contact.phone,
    });

    this.close();
  }
  
  handleSecondaryAction(): void {
    if (this.mode === 'open') {
      this.close();
      return;
    }

    this.contactsService.deleteSelectedContact();
    this.close();
  }

  async submitContact(form: NgForm): Promise<void> {
    const createdContact = await this.contactsService.addContactToDataBase(this.contact);
    form.resetForm();
    this.clearInputFields();
    this.close();
    this.scheduleSuccessToast();
    if (createdContact) {
      this.contactCreated.emit(createdContact);
    }
  }

  clearInputFields(): void {
    this.contact.name = '';
    this.contact.email = '';
    this.contact.phone = '';
  }

  private scheduleSuccessToast(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.clearToastTimeouts();

    const closeAnimationDuration = 400;
    const delayBeforeShow = closeAnimationDuration + 2000;
    const animationDuration = 1800;

    this.toastShowTimeoutId = window.setTimeout(() => {
      this.showSuccessToast = true;
      this.toastHideTimeoutId = window.setTimeout(() => {
        this.showSuccessToast = false;
      }, animationDuration);
    }, delayBeforeShow);
  }

  private clearToastTimeouts(): void {
    if (this.toastShowTimeoutId !== undefined) {
      window.clearTimeout(this.toastShowTimeoutId);
    }
    if (this.toastHideTimeoutId !== undefined) {
      window.clearTimeout(this.toastHideTimeoutId);
    }
    this.toastShowTimeoutId = undefined;
    this.toastHideTimeoutId = undefined;
  }

  private lockBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }
    if (!this.isMobileViewport()) {
      return;
    }
    document.body.classList.add(this.bodyScrollLockClass);
    this.isScrollLocked = true;
  }

  private unlockBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }
    if (!this.isScrollLocked) {
      return;
    }
    document.body.classList.remove(this.bodyScrollLockClass);
    this.isScrollLocked = false;
  }

  private isMobileViewport(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth <= this.mobileBreakpoint;
  }
}
