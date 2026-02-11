import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../firebase-service/task.service';
import { ContactService } from '../firebase-service/contact-service';
import { Contacts } from '../interfaces/contacts';
import { Task, Subtask } from '../interfaces/task';


@Component({
  selector: 'app-add-task-section',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-task-section.html',
  styleUrls: ['./add-task-section.scss']
})
export class AddTaskSection {
  title = '';
  description = '';
  dueDate = '';
  minDate: string;
  priority: 'urgent' | 'medium' | 'low' = 'medium';
  category = '';
  subtasks: Subtask[] = [];
  newSubtask = '';
  taskSavedMessage = false;

  // Assigned To Multi-Select
  isAssignedDropdownOpen = false;
  assignedToContacts: Contacts[] = [];

  constructor(
    private taskService: TaskService,
    public contactService: ContactService
  ) {
    this.minDate = new Date().toISOString().split('T')[0];

    // WICHTIG: Default selected = false für alle Kontakte
    this.contactService.contactList.forEach(c => {
      if (c.selected === undefined) c.selected = false;
    });
  }

  setPriority(value: 'urgent' | 'medium' | 'low') {
    this.priority = value;
  }

  // Subtasks
  addSubtask() {
    if (this.newSubtask.trim()) {
      const subtask: Subtask = { title: this.newSubtask.trim(), completed: false };
      this.subtasks = [...this.subtasks, subtask];
      this.newSubtask = '';
    }
  }

  removeSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  // Assigned To Dropdown
  toggleAssignedDropdown() {
    this.isAssignedDropdownOpen = !this.isAssignedDropdownOpen;
  }

  toggleAssignedContact(contact: Contacts) {
    contact.selected = !contact.selected;

    // Neu berechnen der ausgewählten Kontakte
    this.assignedToContacts = this.contactService.contactList.filter(c => c.selected);
    console.log('Selected Contacts:', this.assignedToContacts);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.assigned-to-container')) {
      this.isAssignedDropdownOpen = false;
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
    this.contactService.contactList.forEach(c => c.selected = false);
  }

async createTask() {
  if (!this.title || !this.dueDate) return;

  const task: Omit<Task, 'createdAt'> = {
    title: this.title,
    description: this.description,
    dueDate: this.dueDate,
    priority: this.priority,
    assignedTo: this.assignedToContacts.map(c => c.name).join(', '),
    category: this.category || 'User Story', // 🔹 Default setzen
    subtasks: this.subtasks,
    status: 'todo'
  };

  try {
    await this.taskService.createTask(task);
    this.clearForm();
    this.taskSavedMessage = true;

    setTimeout(() => this.taskSavedMessage = false, 3000);
  } catch (error) {
    console.error('Error creating task:', error);
  }
}
}
