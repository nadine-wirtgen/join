import { Component, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../firebase-service/task.service';
import { ContactService } from '../../firebase-service/contact-service';
import { Contacts } from '../../interfaces/contacts';
import { Task, Subtask } from '../../interfaces/task';

@Component({
  selector: 'app-add-task-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task-template.html',
  styleUrl: './add-task-template.scss',
})
export class AddTaskTemplate {
  @Input() column: Task['status'] = 'todo';
  isCategoryDropdownOpen: boolean = false;

  toggleCategoryDropdown(event?: Event) {
    if (event) event.stopPropagation();
    const willOpen = !this.isCategoryDropdownOpen;
    this.isCategoryDropdownOpen = willOpen;
    if (!willOpen) {
      this.validateCategory();
    }
  }

  selectCategory(value: string, event: Event) {
    event.stopPropagation();
    this.category = value;
    this.isCategoryDropdownOpen = false;
    this.categoryInvalid = false;
  }

  toggleDropdownArrow(event: Event) {
    event.stopPropagation();
    if (this.isAssignedDropdownOpen) {
      this.isAssignedDropdownOpen = false;
    } else {
      this.openDropdownAll(event);
    }
  }

  contactSearchTerm: string = '';
  showAllContacts: boolean = false;

  openDropdownOnSearch() {
    this.showAllContacts = false;
    this.isAssignedDropdownOpen = true;
  }

  openDropdownAll(event: Event) {
    event.stopPropagation();
    this.showAllContacts = true;
    this.isAssignedDropdownOpen = true;
  }

  filteredContactsToShow(): Contacts[] {
    if (this.showAllContacts) return this.contactService.contactList;
    const term = this.contactSearchTerm.trim().toLowerCase();
    if (!term) return this.contactService.contactList;
    return this.contactService.contactList.filter(c => c.name.toLowerCase().includes(term));
  }

  title = '';
  description = '';
  dueDate = '';
  dueDateInvalid = false;
  titleInvalid = false;
  minDate: string;
  priority: 'urgent' | 'medium' | 'low' = 'medium';
  category = '';
  subtasks: Subtask[] = [];
  newSubtask = '';
  taskSavedMessage = false;

  editingSubtaskIndex: number | null = null;
  editingSubtaskTitle = '';

  isAssignedDropdownOpen = false;
  assignedToContacts: Contacts[] = [];

  constructor(
    private taskService: TaskService,
    public contactService: ContactService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];

    this.contactService.contactList.forEach(c => {
      if (c.selected === undefined) c.selected = false;
    });
  }

  setPriority(value: 'urgent' | 'medium' | 'low') {
    this.priority = value;
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      const subtask: Subtask = { title: this.newSubtask.trim(), completed: false };
      this.subtasks = [...this.subtasks, subtask];
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
    if (!trimmedTitle) {
      this.removeSubtask(index);
      return;
    }

    const updated = { ...this.subtasks[index], title: trimmedTitle };
    this.subtasks.splice(index, 1, updated);

    this.editingSubtaskIndex = null;
    this.editingSubtaskTitle = '';
  }

  getDisplayName(name?: string): string {
    if (!name) return '';
    return name.length >= 20 ? name.slice(0, 15) + '…' : name;
  }

  toggleAssignedDropdown() {
    this.isAssignedDropdownOpen = !this.isAssignedDropdownOpen;
  }

  toggleAssignedContact(contact: Contacts) {
    contact.selected = !contact.selected;
    this.assignedToContacts = this.contactService.contactList.filter(c => c.selected);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.assigned-to-container')) {
      this.isAssignedDropdownOpen = false;
    }

    if (!target.closest('.category-select')) {
      // Close category dropdown and validate when it was open
      if (this.isCategoryDropdownOpen) {
        this.isCategoryDropdownOpen = false;
        this.validateCategory();
      } else {
        this.isCategoryDropdownOpen = false;
      }
    }

	// Close subtask edit mode when clicking outside any subtask item
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
    this.contactService.contactList.forEach(c => (c.selected = false));
    this.titleInvalid = false;
    this.dueDateInvalid = false;
    this.categoryInvalid = false;
    this.editingSubtaskIndex = null;
    this.editingSubtaskTitle = '';
  }

  /**
   * Expects an input in the format dd/mm/yyyy and converts it to ISO (yyyy-mm-dd).
   * Returns null if the value is not a valid calendar date.
   */
  private parseDueDate(input: string): string | null {
    const match = input.trim().match(/^([0-2]\d|3[01])\/(0\d|1[0-2])\/(\d{4})$/);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date.toISOString().split('T')[0];
  }

  validateDueDate() {
    if (!this.dueDate) {
      this.dueDateInvalid = true;
      return;
    }

    const parsed = this.parseDueDate(this.dueDate);
    if (!parsed) {
      this.dueDateInvalid = true;
      return;
    }

    const todayIso = new Date().toISOString().split('T')[0];
    this.dueDateInvalid = parsed < todayIso;
  }

  validateTitle() {
    this.titleInvalid = !this.title || !this.title.trim();
  }

  categoryInvalid = false;

  validateCategory() {
    this.categoryInvalid = !this.category || !this.category.trim();
  }

  get isFormValid(): boolean {
    if (!this.title || !this.title.trim()) return false;
    if (!this.dueDate || this.parseDueDate(this.dueDate) === null) return false;
    if (!this.category || !this.category.trim()) return false;
    return true;
  }

  async createTask() {
    this.validateTitle();
    this.validateDueDate();
    this.validateCategory();

    if (this.titleInvalid || this.dueDateInvalid || this.categoryInvalid) {
      return;
    }

    const parsedDueDate = this.parseDueDate(this.dueDate)!;

    const task: Omit<Task, 'createdAt'> = {
      title: this.title,
      description: this.description,
      dueDate: parsedDueDate,
      priority: this.priority,
      assignedTo: this.assignedToContacts.map(c => c.name),
      category: this.category,
      subtasks: this.subtasks,
      status: this.column,
    };

    try {
      await this.taskService.createTask(task);
      this.clearForm();
      this.taskSavedMessage = true;

      setTimeout(() => (this.taskSavedMessage = false), 3000);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }
}
