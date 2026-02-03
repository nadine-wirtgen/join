import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common'; 
@Component({
  selector: 'app-help-section',
  standalone: true,
  imports: [NgIf], 
  templateUrl: './help-section.html',
  styleUrls: ['./help-section.scss'],
})
export class HelpSection {
  isVisible = true;
  constructor(private router: Router) {}

  closeHelp() {
    this.router.navigate(['/summary']);
  }
}
