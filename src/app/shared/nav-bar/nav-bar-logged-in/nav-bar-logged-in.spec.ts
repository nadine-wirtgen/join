import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarLoggedIn } from './nav-bar-logged-in';

describe('NavBarLoggedIn', () => {
  let component: NavBarLoggedIn;
  let fixture: ComponentFixture<NavBarLoggedIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarLoggedIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarLoggedIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
