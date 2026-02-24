import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../interfaces/task';
import { Contacts } from '../../interfaces/contacts';
import { ContactService } from '../../firebase-service/contact-service';
import { ContactSelector } from './contact-selector/contact-selector';
import { TaskService } from '../../firebase-service/task.service';

interface Subtask {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactSelector],
  templateUrl: './task-overlay.html',
  styleUrls: ['./task-overlay.scss'],
})
export class TaskOverlay implements OnInit, OnChanges {
  @Input() task: (Task & { id: string }) | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
  @Output() save = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>();

  constructor(
    public contactService: ContactService,
    private taskService: TaskService
  ) {}

  isEditMode = false;
  isSaving = false;
  today = new Date().toISOString().split('T')[0];

  hoveredSubtaskIndex: number | null = null;
  editingSubtaskIndex: number | null = null;

  isSubtaskInputFocused: boolean = false;

  assignedContacts: Contacts[] = [];
  private isDeleted = false;

  editedTask: Omit<Task, 'id' | 'createdAt'> = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'User Story',
    subtasks: [],
    status: 'todo',
    assignedTo: [],
    position: 0,
  };

  newSubtaskTitle = '';

  ngOnInit() {
    this.loadTaskData();
    this.loadAssignedContacts();
  }

  ngOnChanges() {
    this.loadAssignedContacts();
  }

  private loadTaskData() {
    if (this.task) {
      const { id, createdAt, ...taskData } = this.task;
      this.editedTask = {
        ...taskData,
        dueDate: this.formatDateForInput(this.task.dueDate),
        assignedTo: this.task.assignedTo || [],
      };
    }
  }

  loadAssignedContacts() {
    if (this.task?.assignedTo?.length) {
      this.assignedContacts = this.contactService.contactList.filter(contact =>
        (this.task?.assignedTo || []).includes(contact.name)
      );
    } else {
      this.assignedContacts = [];
    }
  }

  onContactsChange(selectedNames: string[]) {
    this.editedTask.assignedTo = selectedNames || [];
    this.assignedContacts = this.contactService.contactList.filter(contact =>
      selectedNames.includes(contact.name)
    );
  }

  getContactColor(contact: Contacts): string {
    return this.contactService?.getContactColor(contact) || '#2A3647';
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  get safeTask() {
    const t = this.task;
    return {
      title: t?.title || 'Untitled Task',
      description: t?.description || 'No description provided',
      dueDate: t?.dueDate || new Date().toISOString().split('T')[0],
      priority: t?.priority?.toLowerCase() || 'medium',
      category: t?.category || 'User Story',
      assignedTo: t?.assignedTo || [],
      subtasks: t?.subtasks || [],
    };
  }

  get categoryColor(): string {
    return this.safeTask.category === 'Technical Task' ? '#1FD7C1' : '#0038FF';
  }

openDatePicker(input: HTMLInputElement) {
  if (input.showPicker) {
    input.showPicker();
  } else {
    input.focus();
  }
}

  enableEdit() {
    if (this.task) {
      const { id, createdAt, ...taskData } = this.task;
      this.editedTask = {
        ...taskData,
        dueDate: this.formatDateForInput(this.task.dueDate),
        assignedTo: this.task.assignedTo || [],
      };
      this.isEditMode = true;
    }
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  formatDateForInput(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      this.editedTask.subtasks.push({
        title: this.newSubtaskTitle,
        completed: false
      });
      this.newSubtaskTitle = '';
    }
  }

  removeSubtask(index: number) {
    this.editedTask.subtasks.splice(index, 1);
  }

  startSubtaskEdit(index: number) {
    this.editingSubtaskIndex = index;

    setTimeout(() => {
      const input = document.querySelector('.edit-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }

  saveSubtaskEdit(index: number) {
    if (!this.editedTask.subtasks[index].title.trim()) {
      this.removeSubtask(index);
    }
    this.cancelSubtaskEdit();
  }

  cancelSubtaskEdit() {
    this.editingSubtaskIndex = null;
  }

  toggleSubtask(subtask: Subtask) {
    subtask.completed = !subtask.completed;

    if (this.task?.id) {
      this.taskService.updateTask(this.task.id, {
        subtasks: this.editedTask.subtasks
      }).catch(console.error);
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.editedTask.title?.trim() &&
      this.editedTask.dueDate &&
      this.editedTask.dueDate >= this.today
    );
  }

  onSave() {
    if (!this.isFormValid()) return;

    this.isSaving = true;

    if (this.task) {
      Object.assign(this.task, this.editedTask);
    }

    this.save.emit(this.editedTask);
    this.isEditMode = false;

    setTimeout(() => (this.isSaving = false), 500);
  }

  onDelete() {
    if (this.task?.id) {
      this.isDeleted = true;
      this.delete.emit(this.task.id);
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
  }

  trackByContactId(index: number, contact: Contacts) {
    return contact.id;
  }

  trackBySubtask(index: number, subtask: Subtask) {
    return index;
  }
}
