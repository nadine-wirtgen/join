import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  userInitials: string = '';
  
  isMobile = false;
  
  isHelpOpen = false;

  showPopup: boolean = false;

  appTitle: string = 'Kanban Project Management Tool';

  helpRoute: string = '/help';
  legalNoticeRoute: string = '/legal';
  privacyPolicyRoute: string = '/privacy';

  logoPath: string = 'assets/icon/header/logo_grey.png';
  helpIconPath: string = 'assets/icon/header/help.png';

  constructor(private router: Router) {
    this.initializeUser();
    this.checkScreenSize();
    
    window.addEventListener('resize', () => this.checkScreenSize());
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isHelpOpen = event.url.includes('help');
      });
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  private initializeUser() {
    const savedInitials = localStorage.getItem('userInitials');
    this.userInitials = savedInitials || 'SM';
  }

  toggleHeaderPopup() {
    this.showPopup = !this.showPopup;
  }

  logout() {
    console.log('Logging out...');
    localStorage.removeItem('userInitials');
    this.userInitials = 'GU';
    this.showPopup = false;
  }

  @HostListener('document:click', ['$event'])
  closePopupOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-right') && !target.closest('.header-popup')) {
      this.showPopup = false;
    }
  }
}