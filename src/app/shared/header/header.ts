import { Component, HostListener, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements AfterViewInit {
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

  @ViewChild('desktopPopup') desktopPopup?: ElementRef;
  @ViewChild('mobilePopup') mobilePopup?: ElementRef;

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

  ngAfterViewInit() {
    this.setupPopupAutoClose();
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
    if (this.showPopup) {
      // Jep kohë për DOM të përditësohet
      setTimeout(() => {
        this.setupPopupAutoClose();
      }, 0);
    }
  }

  setupPopupAutoClose() {
    // Gjej popup aktual (desktop ose mobile)
    const popup = this.isMobile ? this.mobilePopup?.nativeElement : this.desktopPopup?.nativeElement;
    
    if (popup && this.showPopup) {
      // Merr të gjitha link-et brenda popup
      const links = popup.querySelectorAll('a');
      
      links.forEach((link: HTMLAnchorElement) => {
        // Shto click event për të mbyllur popup
        link.addEventListener('click', () => {
          this.showPopup = false;
        });
      });
    }
  }

  closePopup() {
    this.showPopup = false;
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