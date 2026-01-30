import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySection } from './summary-section';

describe('SummarySection', () => {
  let component: SummarySection;
  let fixture: ComponentFixture<SummarySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarySection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarySection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
