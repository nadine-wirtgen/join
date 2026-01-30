import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskSection } from './add-task-section';

describe('AddTaskSection', () => {
  let component: AddTaskSection;
  let fixture: ComponentFixture<AddTaskSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
