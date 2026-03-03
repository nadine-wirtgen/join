import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLoggedIn } from './header-logged-in';

describe('HeaderLoggedIn', () => {
  let component: HeaderLoggedIn;
  let fixture: ComponentFixture<HeaderLoggedIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLoggedIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderLoggedIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
