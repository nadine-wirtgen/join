import { Component, OnInit, signal } from '@angular/core';
import { TaskService } from '../firebase-service/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from '../interfaces/task';
import { Taskcard } from './taskcard/taskcard';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
type ColumnKey = 'todo' | 'inProgress' | 'awaitFeedback' | 'done';

@Component({
  selector: 'app-board-section',
  imports: [FormsModule, CommonModule, Taskcard, CdkDrag, CdkDragPreview, CdkDropList],
  templateUrl: './board-section.html',
  styleUrl: './board-section.scss',
})
export class BoardSection implements OnInit {
  hoveredIcon: string | null = null;
  searchValue = '';
  searchTerm = '';
  connectedLists: ColumnKey[] = ['todo', 'inProgress', 'awaitFeedback', 'done'];
  tasks = signal<Record<ColumnKey, (Task & { id: string })[]>>({
    todo: [],
    inProgress: [],
    awaitFeedback: [],
    done: [],
  });
  allTasks: Record<ColumnKey, (Task & { id: string })[]> = {
    todo: [],
    inProgress: [],
    awaitFeedback: [],
    done: [],
  };
  showAddTask: Record<ColumnKey, boolean> = {
    todo: false,
    inProgress: false,
    awaitFeedback: false,
    done: false,
  };
  columnToStatus: Record<ColumnKey, Task['status']> = {
    todo: 'todo',
    inProgress: 'in-progress',
    awaitFeedback: 'await-feedback',
    done: 'done',
  };
  lastPointerX = 0;
  constructor(
    private taskService: TaskService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.taskService.getTasks().subscribe((allTasks) => {
      const grouped = this.groupTasksByStatus(allTasks);
      this.allTasks = grouped;
      this.tasks.set(grouped);
    });
  }
  filterTasks() {
    const term = this.searchTerm.toLowerCase();
    const filtered: Record<ColumnKey, (Task & { id: string })[]> = {
      todo: this.allTasks.todo.filter((t) => this.matchesSearchTerm(t, term)),
      inProgress: this.allTasks.inProgress.filter((t) => this.matchesSearchTerm(t, term)),
      awaitFeedback: this.allTasks.awaitFeedback.filter((t) => this.matchesSearchTerm(t, term)),
      done: this.allTasks.done.filter((t) => this.matchesSearchTerm(t, term)),
    };
    this.tasks.set(filtered);
  }

  // allowDrop(event: DragEvent) {
  //   event.preventDefault();
  // }

  // drag(event: DragEvent) {
  //   this.setDragData(event);
  // }

  drop(event: CdkDragDrop<(Task & { id: string })[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const movedTask = event.container.data[event.currentIndex];

      this.taskService.updateTaskStatus(
        movedTask.id,
        this.columnToStatus[event.container.id as ColumnKey],
      );
    }
  }

  onDragMove(event: CdkDragMove) {
    const currentX = event.pointerPosition.x;
    if (this.lastPointerX === 0) {
      this.lastPointerX = currentX;
      return;
    }
    const deltaX = currentX - this.lastPointerX;
    const rotation = Math.max(-8, Math.min(8, deltaX * 0.5));
    const rotationEl = document.querySelector('.cdk-drag-preview .rotation-wrapper') as HTMLElement;
    if (rotationEl) {
      rotationEl.style.transform = `rotate(${rotation}deg)`;
      // rotationEl.style.left = `${event.pointerPosition.x}px`;
      // rotationEl.style.top = `${event.pointerPosition.y}px`;
    }
    this.lastPointerX = currentX;
  }

  toggleAddTask(column: ColumnKey) {
    this.showAddTask[column] = !this.showAddTask[column];
  }

  addTaskToColumn(column: ColumnKey) {
    console.log('Add Task Button clicked for column:', column);
    this.toggleAddTask(column);
  }

  async createTaskFromForm(column: ColumnKey, formData: Partial<Task>) {
    const newTask: Omit<Task, 'createdAt'> = {
      title: formData.title || 'Neue Aufgabe',
      description: formData.description || '',
      dueDate: formData.dueDate || new Date().toISOString(),
      priority: formData.priority || 'medium',
      category: formData.category || 'User Story',
      subtasks: formData.subtasks || [],
      status: this.columnToStatus[column],
    };
    await this.taskService.createTask(newTask);
    this.showAddTask[column] = false;
  }

  trackById(_index: number, task: Task & { id: string }) {
    return task.id;
  }

  private groupTasksByStatus(
    tasks: (Task & { id: string })[],
  ): Record<ColumnKey, (Task & { id: string })[]> {
    const grouped: Record<ColumnKey, (Task & { id: string })[]> = {
      todo: [],
      inProgress: [],
      awaitFeedback: [],
      done: [],
    };
    tasks.forEach((t) => {
      switch (t.status) {
        case 'todo':
          grouped.todo.push(t);
          break;
        case 'in-progress':
          grouped.inProgress.push(t);
          break;
        case 'await-feedback':
          grouped.awaitFeedback.push(t);
          break;
        case 'done':
          grouped.done.push(t);
          break;
        default:
          grouped.todo.push(t);
      }
    });
    return grouped;
  }
  private matchesSearchTerm(task: Task, term: string): boolean {
    return (
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term) ||
      false
    );
  }
  // private setDragData(event: DragEvent) {
  //   const target = event.target as HTMLElement;
  //   if (target?.id) event.dataTransfer?.setData('text', target.id);
  // }
  // private async handleDrop(event: DragEvent) {
  //   event.preventDefault();
  //   const targetColumn = (event.currentTarget as HTMLElement).id as ColumnKey;
  //   const taskId = event.dataTransfer?.getData('text');
  //   if (!taskId) return;
  //   await this.taskService.updateTaskStatus(taskId, this.columnToStatus[targetColumn]);
  // }
}
