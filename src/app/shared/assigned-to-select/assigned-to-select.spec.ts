import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedToSelect } from './assigned-to-select';

describe('AssignedToSelect', () => {
  let component: AssignedToSelect;
  let fixture: ComponentFixture<AssignedToSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedToSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedToSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
