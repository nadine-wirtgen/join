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
  ) {}

/**
 * Angular lifecycle hook.
 * Called once after component is initialized.
 * Loads the task data and assigned contacts.
 */
ngOnInit() {
  this.loadTaskData();
  this.loadAssignedContacts();
}

/**
 * Angular lifecycle hook.
 * Called whenever input properties change.
 * Reloads task data and assigned contacts to reflect changes.
 * 
 * @param _ - SimpleChanges object (not used)
 */
ngOnChanges(_: SimpleChanges) {
  this.loadTaskData();
  this.loadAssignedContacts();
}

  /**
   * Load the task data into the editable form
   */
  private loadTaskData() {
    if (!this.task) return;
    this.editedTask = this.extractEditableTask(this.task);
  }

  /**
   * Extract editable fields from a task
   */
  private extractEditableTask(task: Task & { id: string }) {
    const { id, createdAt, ...taskData } = task;
    return {
      ...taskData,
      dueDate: this.formatDateForInput(task.dueDate),
      assignedTo: task.assignedTo || [],
    };
  }

  /**
   * Load contacts assigned to the task
   */
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
   * Update contacts when selection changes
   */
  onContactsChange(selectedContacts: Contacts[]) {
    this.editedTask.assignedTo = selectedContacts.map(c => c.name);
    this.assignedContacts = [...selectedContacts];
  }

  /**
   * Get color for a contact avatar
   */
  getContactColor(contact: Contacts): string {
    return this.contactService.getContactColor(contact);
  }

  /**
   * Get initials from contact name
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

  /**
   * Start editing a subtask
   */
  startSubtaskEdit(index: number) {
    this.editingSubtaskIndex = index;
  }

  /**
   * Save the edited subtask
   */
  saveSubtaskEdit(index: number) {
    const title = this.editedTask.subtasks[index]?.title?.trim();
    if (!title) this.removeSubtask(index);
    this.editingSubtaskIndex = null;
  }

  /**
   * Cancel subtask editing
   */
  cancelSubtaskEdit() {
    this.editingSubtaskIndex = null;
  }

  /**
   * Handle keyboard input for subtask editing
   */
  handleSubtaskKey(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') this.saveSubtaskEdit(index);
    if (event.key === 'Escape') this.cancelSubtaskEdit();
  }

  /**
   * Add a new subtask
   */
  addSubtask() {
    if (!this.newSubtaskTitle.trim()) return;
    this.editedTask.subtasks.push(this.createSubtask(this.newSubtaskTitle));
    this.newSubtaskTitle = '';
  }

  /**
   * Create a subtask object
   */
  private createSubtask(title: string): Subtask {
    return { title: title.trim(), completed: false };
  }

  /**
   * Remove a subtask by index
   */
  removeSubtask(index: number) {
    this.editedTask.subtasks.splice(index, 1);
  }

  /**
   * Toggle completion status of a subtask
   */
  toggleSubtask(subtask: Subtask) {
    subtask.completed = !subtask.completed;
    this.updateSubtasksInTask();
  }

  /**
   * Update subtasks in Firebase if task exists
   */
  private updateSubtasksInTask() {
    if (!this.task?.id) return;
    this.taskService.updateTask(this.task.id, { subtasks: this.editedTask.subtasks })
      .catch(console.error);
  }

  /**
   * Enable edit mode
   */
  enableEdit() {
    if (!this.task) return;
    this.editedTask = this.extractEditableTask(this.task);
    this.isEditMode = true;
  }

  /**
   * Cancel edit mode
   */
  cancelEdit() {
    this.isEditMode = false;
  }

  /**
   * Check if form is valid
   */
  private isFormValid(): boolean {
    return !!(this.editedTask.title?.trim() &&
      this.editedTask.dueDate &&
      this.editedTask.dueDate >= this.today);
  }

  /**
   * Save task changes
   */
  onSave() {
    if (!this.isFormValid()) return;
    this.isSaving = true;
    if (this.task) Object.assign(this.task, this.editedTask);
    this.save.emit(this.editedTask);
    this.isEditMode = false;
    this.resetSavingFlag();
  }

  /**
   * Reset saving flag after a delay
   */
  private resetSavingFlag() {
    setTimeout(() => (this.isSaving = false), 500);
  }

  /**
   * Delete the task
   */
  onDelete() {
    if (!this.task?.id) return;
    this.delete.emit(this.task.id);
    this.onClose();
  }

  /**
   * Close overlay
   */
  onClose() {
    this.close.emit();
  }

  /**
   * Format date for input[type=date]
   */
  formatDateForInput(date: string): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  /**
   * Return safe task object for view mode
   */
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

  /**
   * Get category color
   */
  get categoryColor(): string {
    return this.safeTask.category === 'Technical Task' ? '#1FD7C1' : '#0038FF';
  }

  /**
   * Track by contact id for ngFor
   */
  trackByContactId(index: number, contact: Contacts) {
    return contact.id;
  }

  /**
   * Track by index for subtasks
   */
  trackBySubtask(index: number, subtask: Subtask) {
    return index;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const overlay = document.querySelector('.task-overlay');
    if (overlay && !overlay.contains(event.target as Node)) {
      this.onClose();
    }
  }
}