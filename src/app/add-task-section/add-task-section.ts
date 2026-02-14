import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskTemplate } from './add-task-template/add-task-template';


@Component({
  selector: 'app-add-task-section',
  standalone: true,
  imports: [CommonModule, AddTaskTemplate],
  templateUrl: './add-task-section.html',
  styleUrls: ['./add-task-section.scss']
})
export class AddTaskSection {
}
