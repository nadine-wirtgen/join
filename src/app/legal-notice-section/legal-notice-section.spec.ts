import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalNoticeSection } from './legal-notice-section';

describe('LegalNoticeSection', () => {
  let component: LegalNoticeSection;
  let fixture: ComponentFixture<LegalNoticeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNoticeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalNoticeSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
