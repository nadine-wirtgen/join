import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskTemplate } from '../add-task-template/add-task-template';

/**
 * Dialog component for adding a new task.
 * Wraps AddTaskTemplate and handles dialog close events.
 */
@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, AddTaskTemplate],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss',
})
export class AddTaskDialog {
  @Output() close = new EventEmitter<void>();
  @Input() column: 'todo' | 'in-progress' | 'await-feedback' | 'done' = 'todo';
  /**
   * Emits the close event to close the dialog.
   */
  onClose() {
    this.close.emit();
  }
}
