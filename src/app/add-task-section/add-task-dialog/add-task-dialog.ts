import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskTemplate } from '../add-task-template/add-task-template';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, AddTaskTemplate, Output, Input],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss',
})
export class AddTaskDialog {
  @Output() close = new EventEmitter<void>();
  @Input() column: 'todo' | 'inProgress' | 'await-feedback' | 'done' = 'todo';
  onClose() {
    this.close.emit();
  }
}
