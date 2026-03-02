import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TaskService, GroupedTasks } from '../firebase-service/task.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactService } from '../firebase-service/contact-service';

/**
 * SummarySection component.
 *
 * Displays an overview of grouped tasks including:
 * - Urgent task count
 * - Upcoming urgent deadline
 * - Time-based greeting
 * - Responsive behavior for mobile devices
 *
 * The component reacts to window resizing and optionally shows
 * a temporary greeting screen after login on mobile devices.
 */

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-summary-section',
  templateUrl: './summary-section.html',
  styleUrls: ['./summary-section.scss'],
})
export class SummarySection implements OnInit, OnDestroy {
  groupedTasks$!: Observable<GroupedTasks>;
  upcomingDeadline: Date | null = null;
  greeting: string = '';
  userName: string = '';
  maxUserNameLength: number = 15;
  urgentCount: number = 0;
  isMobile = false;
  showGreetingOnly = false;

  private fromLogin = false;
  private greetingTimeout: any;

  /**
   * Creates an instance of SummarySection.
   *
   * @param taskService Service for retrieving and grouping tasks.
   * @param contactService Service for accessing current user information.
   */
  constructor(
    private taskService: TaskService,
    public contactService: ContactService,
  ) {}

  /**
   * Angular lifecycle hook.
   * Initializes user data, greeting, responsive settings,
   * and subscribes to grouped task data.
   */
  ngOnInit(): void {
    this.userName = this.contactService.currentUserName || 'Guest';
    this.setGreeting();
    this.fromLogin = history.state?.fromLogin === true;
    this.checkMobile(window.innerWidth);
    this.setMaxUserNameLength();
    this.groupedTasks$ = this.taskService.getTasksGroupedByStatus().pipe(
      map((grouped) => {
        this.setUpcomingDeadline(grouped);
        this.setUrgent(grouped);
        return grouped;
      }),
    );
  }

  /**
   * Angular lifecycle hook.
   * Clears any active greeting timeout to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.greetingTimeout) clearTimeout(this.greetingTimeout);
  }

  /**
   * Handles window resize events.
   *
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;
    this.checkMobile(width);
    this.setMaxUserNameLength();
  }

  /**
   * Checks whether the viewport width qualifies as mobile.
   * Optionally shows a temporary greeting screen after login.
   *
   * @param width Current viewport width in pixels.
   */
  private checkMobile(width: number) {
    this.isMobile = width <= 1000;
    if (this.isMobile && this.fromLogin) {
      this.showGreetingOnly = true;
      if (this.greetingTimeout) clearTimeout(this.greetingTimeout);
      this.greetingTimeout = setTimeout(() => {
        this.showGreetingOnly = false;
        this.fromLogin = false;
      }, 2000);
    } else {
      this.showGreetingOnly = false;
    }
  }

  /**
   * Sets the greeting message based on the current time of day.
   * - Before 12:00 → "Good morning"
   * - Before 18:00 → "Good afternoon"
   * - Otherwise → "Good evening"
   */
  private setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 18) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  /**
   * Calculates and sets the number of urgent tasks
   * across todo, inProgress, and awaitFeedback groups.
   *
   * @param grouped Tasks grouped by status.
   */
  private setUrgent(grouped: GroupedTasks) {
    const allTasks = [...grouped.todo, ...grouped.inProgress, ...grouped.awaitFeedback];
    this.urgentCount = allTasks.filter((t) => t.priority === 'urgent').length;
  }

  /**
   * Determines and sets the nearest upcoming urgent deadline.
   *
   * @param grouped Tasks grouped by status.
   */
  private setUpcomingDeadline(grouped: GroupedTasks) {
    const allTasks = [...grouped.todo, ...grouped.inProgress, ...grouped.awaitFeedback];
    const nextTask = allTasks
      .filter((t) => t.dueDate && t.priority === 'urgent')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    this.upcomingDeadline = nextTask ? new Date(nextTask.dueDate) : null;
  }

  /**
   * Sets the maximum allowed user name length to a fixed value.
   *
   * @returns {number} The updated maximum user name length.
   */
  private setMaxUserNameLength() {
    return (this.maxUserNameLength = 12);
  }
}
