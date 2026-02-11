import { Timestamp } from '@angular/fire/firestore';

export interface Subtask {
  title: string;
  completed: boolean;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'urgent' | 'medium' | 'low';
  assignedTo?: string;
  category: string;
  subtasks: Subtask[];
  status: 'todo' | 'in-progress' | 'await-feedback' | 'done';
  createdAt: Timestamp;
}
