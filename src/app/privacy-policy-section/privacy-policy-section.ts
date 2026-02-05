import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy-section',
  standalone: true,
  templateUrl: './privacy-policy-section.html',
  styleUrls: ['./privacy-policy-section.scss'],
})
export class PrivacyPolicySection {
  constructor(private location: Location) {}

  closeHelp() {
    this.location.back();
  }
}