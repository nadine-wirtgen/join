import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskTemplate } from '../add-task-template/add-task-template';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, AddTaskTemplate],
  templateUrl: './add-task-dialog.html',
  styleUrls: ['./add-task-dialog.scss'],
})
export class AddTaskDialog {
  @Output() close = new EventEmitter<void>();

  @Input() isDialogOpen: boolean = false;

  @Input() column: 'todo' | 'in-progress' | 'await-feedback' | 'done' = 'todo';

  /**
   * Emits the close event to notify parent component to close the dialog.
   */
  onClose() {
    this.close.emit();
  }
}