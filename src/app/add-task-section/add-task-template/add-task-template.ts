import { Component, HostListener, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../firebase-service/task.service';
import { ContactService } from '../../firebase-service/contact-service';
import { Contacts } from '../../interfaces/contacts';
import { Task, Subtask } from '../../interfaces/task';
import { AssignedToSelectComponent } from '../../shared/assigned-to-select/assigned-to-select';

import { collectionData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-task-template',
  standalone: true,
  imports: [CommonModule, FormsModule, AssignedToSelectComponent],
  templateUrl: './add-task-template.html',
  styleUrls: ['./add-task-template.scss'],
})
export class AddTaskTemplate implements OnInit {
  @Input() column: Task['status'] = 'todo';
  @Input() isDialogMode = false;
  @Output() closeDialog = new EventEmitter<void>();

  title = '';
  description = '';
  dueDate = '';
  dueDateInvalid = false;
  titleInvalid = false;
  priority: 'urgent' | 'medium' | 'low' = 'medium';
  category = '';
  categoryInvalid = false;
  subtasks: Subtask[] = [];
  newSubtask = '';
  editingSubtaskIndex: number | null = null;
  editingSubtaskTitle = '';
  taskSavedMessage = false;

  assignedToContacts: Contacts[] = [];
  allContacts: Contacts[] = [];
  today: string;
  isCategoryDropdownOpen = false;

  constructor(
    private taskService: TaskService,
    public contactService: ContactService
  ) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Contacts laden
    collectionData(this.contactService.getContactsRef(), { idField: 'id' })
      .pipe(
        map((contacts: any[]) =>
          contacts.map(c => ({
            id: c.id?.toString(),
            name: c.name || '',
            email: c.email || '',
            phone: c.phone || '',
            selected: false
          } as Contacts))
        )
      )
      .subscribe((contacts: Contacts[]) => {
        this.allContacts = contacts;
      });
  }

  setPriority(value: 'urgent' | 'medium' | 'low') { this.priority = value; }

  toggleCategoryDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
    if (!this.isCategoryDropdownOpen) this.validateCategory();
  }

  selectCategory(value: string, event: Event) {
    event.stopPropagation();
    this.category = value;
    this.isCategoryDropdownOpen = false;
    this.categoryInvalid = false;
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push({ title: this.newSubtask.trim(), completed: false });
      this.newSubtask = '';
    }
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
    if (this.editingSubtaskIndex !== null) {
      if (this.editingSubtaskIndex === index) {
        this.editingSubtaskIndex = null;
        this.editingSubtaskTitle = '';
      } else if (this.editingSubtaskIndex > index) {
        this.editingSubtaskIndex--;
      }
    }
  }

  startEditSubtask(index: number, title: string) {
    this.editingSubtaskIndex = index;
    this.editingSubtaskTitle = title;
  }

  saveSubtaskEdit(index: number) {
    if (this.editingSubtaskIndex !== index) return;
    const trimmedTitle = this.editingSubtaskTitle.trim();
    if (!trimmedTitle) { this.removeSubtask(index); return; }
    this.subtasks[index] = { ...this.subtasks[index], title: trimmedTitle };
    this.editingSubtaskIndex = null;
    this.editingSubtaskTitle = '';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Kategorie Dropdown schließen
    if (!target.closest('.category-select')) {
      if (this.isCategoryDropdownOpen) {
        this.isCategoryDropdownOpen = false;
        this.validateCategory();
      }
    }

    // Subtask Editing abbrechen
    if (!target.closest('.subtask-item')) {
      this.editingSubtaskIndex = null;
      this.editingSubtaskTitle = '';
    }
  }

  clearForm() {
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = 'medium';
    this.category = '';
    this.subtasks = [];
    this.newSubtask = '';
    this.assignedToContacts = [];
    this.allContacts.forEach(c => (c as any).selected = false);
    this.titleInvalid = false;
    this.dueDateInvalid = false;
    this.categoryInvalid = false;
    this.editingSubtaskIndex = null;
    this.editingSubtaskTitle = '';

    if (this.isDialogMode) this.closeDialog.emit();
  }

  validateTitle() {
    const trimmed = this.title ? this.title.trim() : '';
    this.titleInvalid = !trimmed || trimmed.length < 2 || /^\d+$/.test(trimmed);
  }

  validateDueDate() {
    const todayIso = new Date().toISOString().split('T')[0];
    this.dueDateInvalid = !this.dueDate || this.dueDate < todayIso;
  }

  validateCategory() { this.categoryInvalid = !this.category || !this.category.trim(); }

  get isFormValid(): boolean {
    const todayIso = new Date().toISOString().split('T')[0];
    return !!this.title && !!this.dueDate && this.dueDate >= todayIso && !!this.category?.trim();
  }

  async createTask() {
    this.validateTitle();
    this.validateCategory();
    if (this.titleInvalid || !this.isFormValid || this.categoryInvalid) return;

    const task: Omit<Task, 'createdAt'> = {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      assignedTo: this.assignedToContacts.map(c => c.name),
      category: this.category,
      subtasks: this.subtasks,
      status: this.column,
      position: 0
    };

    try {
      await this.taskService.createTask(task);
      this.handleTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  private handleTaskCreated() {
    this.clearForm();
    this.taskSavedMessage = true;
    const hideMessage = () => this.taskSavedMessage = false;
    if (this.isDialogMode) setTimeout(() => { hideMessage(); this.closeDialog.emit(); }, 1000);
    else setTimeout(() => { hideMessage(); }, 1000);
  }
}