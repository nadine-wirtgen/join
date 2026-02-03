import { Routes } from '@angular/router';
import { ContactSection } from './contact-section/contact-section';
import { SummarySection } from './summary-section/summary-section';
import { AddTaskSection } from './add-task-section/add-task-section';
import { BoardSection } from './board-section/board-section';
import { HelpSection } from './help-section/help-section';
import { LegalNoticeSection } from './legal-notice-section/legal-notice-section';
import { PrivacyPolicySection } from './privacy-policy-section/privacy-policy-section';

export const routes: Routes = [
  { path: '', redirectTo: 'summary', pathMatch: 'full' },

  { path: 'summary', component: SummarySection },
  { path: 'add-task', component: AddTaskSection },
  { path: 'board', component: BoardSection },
  { path: 'contacts', component: ContactSection },

  { path: 'help', component: HelpSection },
  { path: 'legal', component: LegalNoticeSection },
  { path: 'privacy', component: PrivacyPolicySection },
];
