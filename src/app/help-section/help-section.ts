import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-help-section',
  standalone: true,
  templateUrl: './help-section.html',
  styleUrls: ['./help-section.scss'],
})
export class HelpSection {
  constructor(private location: Location) {}

  closeHelp() {
    this.location.back();
  }
}