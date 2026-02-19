import { Component } from '@angular/core';
import { AddTaskTemplate } from '../add-task-template/add-task-template';

@Component({
  selector: 'app-add-task',
  imports: [AddTaskTemplate],
  templateUrl: './add-task.html',
  styleUrl: './add-task.scss',
})
export class AddTask {

}
