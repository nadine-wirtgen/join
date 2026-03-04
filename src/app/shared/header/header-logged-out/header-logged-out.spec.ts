import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLoggedOut } from './header-logged-out';

describe('HeaderLoggedOut', () => {
  let component: HeaderLoggedOut;
  let fixture: ComponentFixture<HeaderLoggedOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLoggedOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderLoggedOut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
