import { Injectable, signal } from '@angular/core';

/**
 * BurgermenuStateService
 *
 * Manages the global state of burger menus in the board.
 * Only one menu can be open at a time.
 */
@Injectable({
  providedIn: 'root',
})
export class BurgermenuStateService {
  /** ID of the task whose menu is currently open */
  private openTaskId = signal<string | null>(null);

  /**
   * Opens the menu for the specified task ID.
   * If another menu is already open, it will be closed automatically.
   * @param id The ID of the task to open the menu for
   */
  open(id: string) {
    this.openTaskId.set(id);
  }

  /**
   * Closes any currently open menu.
   */
  close() {
    this.openTaskId.set(null);
  }

  /**
   * Checks whether the menu for the given task ID is open.
   * @param id The ID of the task to check
   * @returns True if the menu is currently open, false otherwise
   */
  isOpen(id: string): boolean {
    return this.openTaskId() === id;
  }
}