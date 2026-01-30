import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicySection } from './privacy-policy-section';

describe('PrivacyPolicySection', () => {
  let component: PrivacyPolicySection;
  let fixture: ComponentFixture<PrivacyPolicySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicySection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicySection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
