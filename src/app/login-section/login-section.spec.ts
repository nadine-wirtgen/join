import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSection } from './login-section';

describe('LoginSection', () => {
  let component: LoginSection;
  let fixture: ComponentFixture<LoginSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
