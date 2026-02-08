import { Routes } from '@angular/router';

import { LoginSection } from './login-section/login-section';
import { LoginComponent } from './login-section/login/login';
import { SignupComponent } from './login-section/signup/signup';

import { MainLayout } from './layout/main-layout/main-layout';
import { SummarySection } from './summary-section/summary-section';
import { AddTaskSection } from './add-task-section/add-task-section';
import { BoardSection } from './board-section/board-section';
import { ContactSection } from './contact-section/contact-section';
import { HelpSection } from './help-section/help-section';
import { LegalNoticeSection } from './legal-notice-section/legal-notice-section';
import { PrivacyPolicySection } from './privacy-policy-section/privacy-policy-section';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginSection,
    children: [
      { path: '', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },

  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'summary', component: SummarySection },
      { path: 'add-task', component: AddTaskSection },
      { path: 'board', component: BoardSection },
      { path: 'contacts', component: ContactSection },
      { path: 'help', component: HelpSection },
      { path: 'legal', component: LegalNoticeSection },
      { path: 'privacy', component: PrivacyPolicySection },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
