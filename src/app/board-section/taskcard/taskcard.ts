import { Component, Input } from '@angular/core';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'app-taskcard',
  standalone: true,
  imports: [],
  templateUrl: './taskcard.html',
  styleUrls: ['./taskcard.scss'],
})
export class Taskcard {
  @Input() task!: Task;

  getSubtaskProgress(task?: Task): number {
    const t = task || this.task;
    if (!t) return 0;
    return this.calculateProgress(t as Task & { id: string });
  }
  getCompletedCount(task?: Task): number {
    const t = task || this.task;
    return t?.subtasks?.filter((st) => st.completed).length || 0;
  }

  private calculateProgress(task: Task & { id: string }): number {
    if (!task.subtasks?.length) return 0;
    const completed = task.subtasks.filter((st) => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }
}
