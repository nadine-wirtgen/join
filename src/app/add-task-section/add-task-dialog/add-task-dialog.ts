import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskTemplate } from '../add-task-template/add-task-template';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, AddTaskTemplate],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.scss',
})
export class AddTaskDialog {}
