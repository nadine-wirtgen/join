import {
  Component,
  HostListener,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit
} from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../firebase-service/auth.servic';
import { ContactService } from '../../../firebase-service/contact-service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header-logged-in',
  imports: [RouterModule],
  templateUrl: './header-logged-in.html',
  styleUrl: './header-logged-in.scss',
})
export class HeaderLoggedIn {
   userInitials: string = 'G';

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

  constructor(
    private router: Router,
    private auth: AuthService,
    private contactService: ContactService
  ) {
    this.checkScreenSize();

    window.addEventListener('resize', () => this.checkScreenSize());

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isHelpOpen = event.url.includes('help');
      });
  }

  ngOnInit(): void {
    this.setUserInitials();
  }

  // 🔹 Initialen aus aktuellem Service-Wert holen
  private setUserInitials() {
    const name = this.contactService.currentUserName;

    if (!name) {
      this.userInitials = 'G';
      return;
    }

    this.userInitials = this.contactService.getInitials(name) || 'G';
  }

  logout() {
  			this.contactService.clearCurrentUser(); // setzt Name auf null
  			this.userInitials = 'G';
  			this.showPopup = false;
			sessionStorage.removeItem('loginAnimationPlayed');
  			this.auth.logout();
  			this.router.navigate(['/login']);
		}


  ngAfterViewInit() {
    this.setupPopupAutoClose();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleHeaderPopup() {
    this.showPopup = !this.showPopup;

    if (this.showPopup) {
      setTimeout(() => {
        this.setupPopupAutoClose();
      }, 0);
    }
  }

  setupPopupAutoClose() {
    const popup = this.isMobile
      ? this.mobilePopup?.nativeElement
      : this.desktopPopup?.nativeElement;

    if (popup && this.showPopup) {
      const links = popup.querySelectorAll('a');

      links.forEach((link: HTMLAnchorElement) => {
        link.addEventListener('click', () => {
          this.showPopup = false;
        });
      });
    }
  }

  @HostListener('document:click', ['$event'])
  closePopupOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-right') && !target.closest('.header-popup')) {
      this.showPopup = false;
    }
  }
}


