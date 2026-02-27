import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { TaskService, GroupedTasks } from '../firebase-service/task.service';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactService } from '../firebase-service/contact-service';

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

  constructor(
    private taskService: TaskService,
    public contactService: ContactService,
  ) {}

  ngOnInit(): void {
    this.userName = this.contactService.currentUserName || 'Guest';
    this.setGreeting();
    this.fromLogin = history.state?.fromLogin === true;
    this.checkMobile(window.innerWidth);
    this.setMaxUserNameLength(window.innerWidth);
    this.groupedTasks$ = this.taskService.getTasksGroupedByStatus().pipe(
      map((grouped) => {
        this.setUpcomingDeadline(grouped);
        this.setUrgent(grouped);
        return grouped;
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.greetingTimeout) clearTimeout(this.greetingTimeout);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;
    this.checkMobile(width);
    this.setMaxUserNameLength(width);
  }

  private checkMobile(width: number) {
    this.isMobile = width <= 768;
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

  private setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 18) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  private setUrgent(grouped: GroupedTasks) {
    const allTasks = [...grouped.todo, ...grouped.inProgress, ...grouped.awaitFeedback];
    this.urgentCount = allTasks.filter((t) => t.priority === 'urgent').length;
  }

  private setUpcomingDeadline(grouped: GroupedTasks) {
    const allTasks = [...grouped.todo, ...grouped.inProgress, ...grouped.awaitFeedback];
    const nextTask = allTasks
      .filter((t) => t.dueDate && t.priority === 'urgent')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    this.upcomingDeadline = nextTask ? new Date(nextTask.dueDate) : null;
  }

  private setMaxUserNameLength(width: number) {
    if (width <= 320) {
      this.maxUserNameLength = 8;
    } else if (width <= 360) {
      this.maxUserNameLength = 10;
    } else if (width <= 460) {
      this.maxUserNameLength = 12;
    } else if (width <= 768) {
      this.maxUserNameLength = 15;
    } else {
      this.maxUserNameLength = 20;
    }
  }
}
