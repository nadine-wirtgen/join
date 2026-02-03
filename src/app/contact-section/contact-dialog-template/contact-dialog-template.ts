import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-contact-dialog-template',
  standalone: true,
  imports: [],
  templateUrl: './contact-dialog-template.html',
  styleUrl: './contact-dialog-template.scss',
})
export class ContactDialogTemplate {
  @Input() mode: 'open' | 'change' = 'open';
  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;

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

  getText(text: string): string {
    const parts = text.split('||');
    const left = parts[0]?.trim() ?? '';
    const right = parts[1]?.trim() ?? '';
    return this.mode === 'change' ? right : left;
  }

}
