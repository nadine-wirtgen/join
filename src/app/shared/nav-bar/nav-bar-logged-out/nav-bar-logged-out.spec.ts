import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarLoggedOut } from './nav-bar-logged-out';

describe('NavBarLoggedOut', () => {
  let component: NavBarLoggedOut;
  let fixture: ComponentFixture<NavBarLoggedOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarLoggedOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarLoggedOut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
