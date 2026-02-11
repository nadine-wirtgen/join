import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  collectionData,
  Timestamp,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../interfaces/task';

export type GroupedTasks = {
  todo: (Task & { id: string })[];
  inProgress: (Task & { id: string })[];
  awaitFeedback: (Task & { id: string })[];
  done: (Task & { id: string })[];
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: Firestore) {}

  // 🔹 Getter für Firestore Collection (verhindert TS2729 Fehler)
  private get tasksCollection() {
    return collection(this.firestore, 'tasks');
  }

  // 🔹 Alle Tasks als Realtime Observable
  getTasks(): Observable<(Task & { id: string })[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<(Task & { id: string })[]>;
  }

  // 🔹 Tasks direkt nach Status gruppieren (ideal für Board + DragDrop)
  getTasksGroupedByStatus(): Observable<GroupedTasks> {
    return this.getTasks().pipe(
      map(tasks => ({
        todo: tasks.filter(t => t.status === 'todo'),
        inProgress: tasks.filter(t => t.status === 'in-progress'),
        awaitFeedback: tasks.filter(t => t.status === 'await-feedback'),
        done: tasks.filter(t => t.status === 'done')
      }))
    );
  }

  // 🔹 Neue Aufgabe erstellen
  async createTask(task: Omit<Task, 'createdAt'>) {
    return addDoc(this.tasksCollection, {
      ...task,
      createdAt: Timestamp.now()
    });
  }

  // 🔹 Status ändern (wichtig für Drag & Drop)
  async updateTaskStatus(taskId: string, status: Task['status']) {
    const docRef = doc(this.firestore, `tasks/${taskId}`);
    await updateDoc(docRef, { status });
  }

  // 🔹 Task komplett aktualisieren
  async updateTask(
    taskId: string,
    taskData: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) {
    const docRef = doc(this.firestore, `tasks/${taskId}`);
    await updateDoc(docRef, taskData as DocumentData);
  }

  // 🔹 Task löschen
  async deleteTask(taskId: string) {
    const docRef = doc(this.firestore, `tasks/${taskId}`);
    await deleteDoc(docRef);
  }

  // 🔹 Subtask Fortschritt berechnen (0-100%)
  getSubtaskProgress(task: Task): number {
    if (!task.subtasks || task.subtasks.length === 0) return 0;

    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }

  // 🔹 Anzahl abgeschlossener Subtasks
  getCompletedCount(task: Task): number {
    return task.subtasks?.filter(st => st.completed).length || 0;
  }
}
