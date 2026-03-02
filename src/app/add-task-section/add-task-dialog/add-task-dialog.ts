import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskTemplate } from '../add-task-template/add-task-template';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, AddTaskTemplate],
  templateUrl: './add-task-dialog.html',
  styleUrls: ['./add-task-dialog.scss'], // styleUrl -> styleUrls
})
export class AddTaskDialog {
  @Output() close = new EventEmitter<void>();

  // NEU: Input für Sichtbarkeit des Dialogs
  @Input() isDialogOpen: boolean = false;

  @Input() column: 'todo' | 'in-progress' | 'await-feedback' | 'done' = 'todo';

  onClose() {
    this.close.emit();
  }
}