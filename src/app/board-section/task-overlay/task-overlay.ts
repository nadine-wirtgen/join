import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../interfaces/task';
import { Contacts } from '../../interfaces/contacts';
import { ContactService } from '../../firebase-service/contact-service';
import { AssignedToSelectComponent } from '../../shared/assigned-to-select/assigned-to-select';
import { TaskService } from '../../firebase-service/task.service';

interface Subtask {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule, AssignedToSelectComponent],
  templateUrl: './task-overlay.html',
  styleUrls: ['./task-overlay.scss'],
})
export class TaskOverlay implements OnInit, OnChanges {
  @Input() task: (Task & { id: string }) | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();
  @Output() save = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>();

  isEditMode = false;
  isSaving = false;
  today = new Date().toISOString().split('T')[0];

  editingSubtaskIndex: number | null = null;
  hoveredSubtaskIndex: number | null = null;
  newSubtaskTitle = '';
  subtaskBackup: string | null = null;
  originalDueDate: string | null = null;

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

  constructor(
    public contactService: ContactService,
    private taskService: TaskService,
  ) { }

  /** Angular lifecycle hook: initialize component */
  ngOnInit() {
    this.loadTaskData();
    this.loadAssignedContacts();
  }

  /** Angular lifecycle hook: respond to input changes */
  ngOnChanges(_: SimpleChanges) {
    this.loadTaskData();
    this.loadAssignedContacts();
  }

  /** Load task data into editedTask */
  private loadTaskData() {
    if (!this.task) return;

    this.editedTask = this.extractEditableTask(this.task);
    this.originalDueDate = this.editedTask.dueDate;
  }

  /**
   * Extract editable fields from task
   * @param task Task with id
   * @returns Editable task object
   */
  private extractEditableTask(task: Task & { id: string }) {
    const { id, createdAt, ...taskData } = task;
    return {
      ...taskData,
      dueDate: this.formatDateForInput(task.dueDate),
      assignedTo: task.assignedTo || [],
    };
  }

  /** Load contacts assigned to the task */
  private loadAssignedContacts() {
    if (this.task?.assignedTo?.length) {
      this.assignedContacts = this.contactService.contactList.filter(c =>
        (this.task?.assignedTo || []).includes(c.name)
      );
    } else {
      this.assignedContacts = [];
    }
  }

  /**
   * Update assigned contacts when selection changes
   * @param selectedContacts Array of selected contacts
   */
  onContactsChange(selectedContacts: Contacts[]) {
    this.editedTask.assignedTo = selectedContacts.map(c => c.name);
    this.assignedContacts = [...selectedContacts];
  }

  /**
   * Get color for a contact
   * @param contact Contact object
   * @returns Hex color string
   */
  getContactColor(contact: Contacts): string {
    return this.contactService.getContactColor(contact);
  }

  /**
   * Get initials from contact name
   * @param name Contact name
   * @returns Initials string
   */
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  /** Start editing a subtask */
  startSubtaskEdit(index: number) {
    this.editingSubtaskIndex = index;
    this.subtaskBackup = this.editedTask.subtasks[index]?.title || '';
  }

  /**
   * Save changes to a subtask
   * @param index Subtask index
   */
  saveSubtaskEdit(index: number) {
    const title = this.editedTask.subtasks[index]?.title?.trim();
    if (!title) this.removeSubtask(index);
    this.editingSubtaskIndex = null;
    this.subtaskBackup = null;
  }

  /** Cancel editing a subtask and restore original title */
  cancelSubtaskEdit() {
    if (this.editingSubtaskIndex !== null && this.subtaskBackup !== null) {
      this.editedTask.subtasks[this.editingSubtaskIndex].title = this.subtaskBackup;
      this.editingSubtaskIndex = null;
      this.subtaskBackup = null;
    }
  }

  /**
   * Handle key events for subtask input
   * @param event KeyboardEvent
   * @param index Subtask index
   */
  handleSubtaskKey(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') this.saveSubtaskEdit(index);
    if (event.key === 'Escape') this.cancelSubtaskEdit();
  }

  /** Add a new subtask */
  addSubtask() {
    if (!this.newSubtaskTitle.trim()) return;
    this.editedTask.subtasks.push({ title: this.newSubtaskTitle.trim(), completed: false });
    this.newSubtaskTitle = '';
  }

  /**
   * Remove a subtask
   * @param index Index of subtask to remove
   */
  removeSubtask(index: number) {
    this.editedTask.subtasks.splice(index, 1);
    if (this.editingSubtaskIndex === index) {
      this.editingSubtaskIndex = null;
      this.subtaskBackup = null;
    }
  }

  /**
   * Toggle completion status of a subtask
   * @param subtask Subtask object
   */
  toggleSubtask(subtask: Subtask) {
    subtask.completed = !subtask.completed;
    this.updateSubtasksInTask();
  }

  /** Update subtasks in backend if task exists */
  private updateSubtasksInTask() {
    if (!this.task?.id) return;
    this.taskService.updateTask(this.task.id, { subtasks: this.editedTask.subtasks })
      .catch(console.error);
  }

  /** Enable edit mode */
  enableEdit() {
    if (!this.task) return;
    this.editedTask = this.extractEditableTask(this.task);
    this.isEditMode = true;
  }

  /** Cancel edit mode */
  cancelEdit() {
    this.isEditMode = false;
  }

  /** Check if the form is valid */
  private isFormValid(): boolean {
    return !!(
      this.editedTask.title?.trim() &&
      this.editedTask.dueDate
    );
  }

  /** Save the task */
  onSave() {
    if (!this.isFormValid()) return;

    this.isSaving = true;
    if (this.task) Object.assign(this.task, this.editedTask);
    this.save.emit(this.editedTask);
    this.isEditMode = false;
    this.resetSavingFlag();
  }

  /** Reset the saving flag */
  private resetSavingFlag() {
    setTimeout(() => (this.isSaving = false), 500);
  }

  /** Delete the task */
  onDelete() {
    if (!this.task?.id) return;
    this.delete.emit(this.task.id);
    this.onClose();
  }

  /** Close the overlay */
  onClose() {
    this.close.emit();
  }

  /**
   * Format date string for input[type=date]
   * @param date Date string
   * @returns YYYY-MM-DD formatted string
   */
  formatDateForInput(date: string): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  /** Return safe task object for view */
  get safeTask() {
    const t = this.task;
    return {
      title: t?.title || 'Untitled Task',
      description: t?.description || 'No description provided',
      dueDate: t?.dueDate || this.today,
      priority: t?.priority?.toLowerCase() || 'medium',
      category: t?.category || 'User Story',
      assignedTo: t?.assignedTo || [],
      subtasks: t?.subtasks || [],
    };
  }

  /** Check if due date is in the past */
  isDateInPast(): boolean {
    if (!this.editedTask.dueDate) return false;
    if (this.editedTask.dueDate === this.originalDueDate) return false;

    const selected = new Date(this.editedTask.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selected < today;
  }

  /** Get color for category */
  get categoryColor(): string {
    return this.safeTask.category === 'Technical Task' ? '#1FD7C1' : '#0038FF';
  }

  /**
   * Track contact for ngFor
   * @param index Index
   * @param contact Contact object
   */
  trackByContactId(index: number, contact: Contacts) {
    return contact.id;
  }

  /**
   * Track subtask for ngFor
   * @param index Index
   * @param subtask Subtask object
   */
  trackBySubtask(index: number, subtask: Subtask) {
    return index;
  }

  /**
   * Handle clicks outside overlay to close
   * @param event MouseEvent
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const overlay = document.querySelector('.task-overlay');
    if (overlay && !overlay.contains(event.target as Node)) {
      this.onClose();
    }
  }
}