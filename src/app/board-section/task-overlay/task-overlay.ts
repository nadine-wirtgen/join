import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../interfaces/task';
import { Contacts } from '../../interfaces/contacts';
import { ContactService } from '../../firebase-service/contact-service';
import { ContactSelector } from './contact-selector/contact-selector';

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

  constructor(private contactService: ContactService) {}

  isEditMode = false;
  isSaving = false;
  today = new Date().toISOString().split('T')[0];

  hoveredSubtaskIndex: number | null = null;
  editingSubtaskIndex: number | null = null;
  editingSubtaskTitle = '';
  showAllSubtasks = false;
  showAllSubtasksView = false;
  showAllSubtasksEdit = false;
  showAllAssignedInView = false;
  deleteHover = false;
  editHover = false;

  get displayedAssignedInView() {
    if (this.showAllAssignedInView) {
      return this.assignedContacts;
    } else {
      return this.assignedContacts.slice(0, 3);
    }
  }

  get hiddenAssignedInViewCount() {
    if (this.assignedContacts.length <= 3) {
      return 0;
    }
    return this.assignedContacts.length - 3;
  }

  toggleAssignedInView() {
    this.showAllAssignedInView = !this.showAllAssignedInView;
  }

  assignedContacts: Contacts[] = [];

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
    if (this.task?.assignedTo?.length && this.contactService) {
      this.assignedContacts = this.contactService.contactList.filter((contact) => {
        if (!contact.name) return false;
        return this.task?.assignedTo?.includes(contact.name) || false;
      });
    } else {
      this.assignedContacts = [];
    }
  }

  onContactsChange(contacts: Contacts[]) {
    this.editedTask.assignedTo = contacts
      .map((c) => c.name)
      .filter((id): id is string => id !== undefined);
  }

  getContactColor(contact: Contacts): string {
    return this.contactService?.getContactColor(contact) || '#2A3647';
  }

  getInitials(name: string): string {
    return this.contactService?.getInitials(name) || this.getInitialsLocal(name);
  }

  private getInitialsLocal(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
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

  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.editedTask.priority = priority;
  }

  isPriorityActive(priority: string): boolean {
    return this.editedTask.priority === priority;
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      if (!this.editedTask.subtasks) {
        this.editedTask.subtasks = [];
      }
      this.editedTask.subtasks.push({
        title: this.newSubtaskTitle,
        completed: false,
      });
      this.newSubtaskTitle = '';
    }
  }

  removeSubtask(index: number) {
    if (this.editedTask.subtasks) {
      this.editedTask.subtasks.splice(index, 1);
    }
  }

  toggleSubtask(subtask: Subtask) {
    subtask.completed = !subtask.completed;
  }

  startSubtaskEdit(index: number, title: string) {
    this.editingSubtaskIndex = index;
    this.editingSubtaskTitle = title;

    setTimeout(() => {
      const input = document.querySelector('.subtask-item input');
      if (input) (input as HTMLInputElement).focus();
    });
  }

  saveSubtaskEdit(index: number) {
    if (this.editingSubtaskTitle.trim() && this.editedTask.subtasks) {
      this.editedTask.subtasks[index].title = this.editingSubtaskTitle;
    }
    this.cancelSubtaskEdit();
  }

  cancelSubtaskEdit() {
    this.editingSubtaskIndex = null;
    this.editingSubtaskTitle = '';
  }

  resetSubtaskInput() {
    this.newSubtaskTitle = '';
  }

  private isFormValid(): boolean {
    return !!(
      this.editedTask.title?.trim() &&
      this.editedTask.dueDate &&
      this.editedTask.dueDate >= this.today
    );
  }

  onSave() {
    if (!this.isFormValid()) {
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      this.save.emit(this.editedTask);
      this.isEditMode = false;
      this.isSaving = false;
    }, 500);
  }

  onDelete() {
    if (this.task?.id) {
      this.delete.emit(this.task.id);
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
  }
}
