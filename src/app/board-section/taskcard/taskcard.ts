import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { Task } from '../../interfaces/task';
import { ContactService } from '../../firebase-service/contact-service';
import { CommonModule, SlicePipe } from '@angular/common';
import { TaskService } from '../../firebase-service/task.service';

@Component({
  selector: 'app-taskcard',
  standalone: true,
  imports: [SlicePipe, CommonModule],
  templateUrl: './taskcard.html',
  styleUrls: ['./taskcard.scss'],
})
export class Taskcard {
  @Input() task!: Task;
  @Output() openTask = new EventEmitter<Task>();
  contactService = inject(ContactService);
  private taskService = inject(TaskService);
  private elementRef = inject(ElementRef);
  menuOpen = false;
  statusOrder: Task['status'][] = ['todo', 'in-progress', 'await-feedback', 'done'];

  onCardClick() {
    this.openTask.emit(this.task);
  }

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

  getDisplayTitle(title?: string): string {
    return title && title.length >= 30 ? title.slice(0, 30) + '…' : (title ?? '');
  }

  getDisplayDescription(description?: string): string {
    return description && description.length >= 100
      ? description.slice(0, 100) + '…'
      : (description ?? '');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  async moveStatus(direction: 'up' | 'down') {
    if (!this.task?.id) return;
    const currentIndex = this.statusOrder.indexOf(this.task.status);
    let newIndex = currentIndex;
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    if (direction === 'down' && currentIndex < this.statusOrder.length - 1) {
      newIndex = currentIndex + 1;
    }
    const newStatus = this.statusOrder[newIndex];
    if (newStatus !== this.task.status) {
      await this.taskService.updateTaskStatus(this.task.id, newStatus);
    }
  }
}
