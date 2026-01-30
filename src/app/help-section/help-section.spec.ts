import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSection } from './help-section';

describe('HelpSection', () => {
  let component: HelpSection;
  let fixture: ComponentFixture<HelpSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
