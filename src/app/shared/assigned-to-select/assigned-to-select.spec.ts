import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedToSelectComponent } from './assigned-to-select';

describe('AssignedToSelectComponent', () => {
  let component: AssignedToSelectComponent;
  let fixture: ComponentFixture<AssignedToSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedToSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedToSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
