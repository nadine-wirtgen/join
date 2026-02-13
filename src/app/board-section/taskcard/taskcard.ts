import { Component, inject, Input } from '@angular/core';
import { Task } from '../../interfaces/task';
import { ContactService } from '../../firebase-service/contact-service';
import { CommonModule, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-taskcard',
  standalone: true,
  imports: [SlicePipe, CommonModule],
  templateUrl: './taskcard.html',
  styleUrls: ['./taskcard.scss'],
})
export class Taskcard {
  @Input() task!: Task;
  contactService = inject(ContactService);

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

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
    return initials.toUpperCase();
  }

  getContactByName(name: string) {
    return this.contactService.contactList.find((c) => c.name === name);
  }
}
