import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-legal-notice-section',
  standalone: true,
  templateUrl: './legal-notice-section.html',
  styleUrls: ['./legal-notice-section.scss'],
})
export class LegalNoticeSection {
  constructor(
    private location: Location,
  ) {}

/**
 * Navigates back to the previous page.
 * Typically used to close the help section.
 */
closeHelp(): void {
  this.location.back();
}
}