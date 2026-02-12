import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Taskcard } from './taskcard/taskcard';

@Component({
  selector: 'app-board-section',
  imports: [FormsModule, CommonModule, Taskcard],
  templateUrl: './board-section.html',
  styleUrl: './board-section.scss',
})
export class BoardSection {
  hoveredIcon: string | null = null;
  searchValue = '';
}
