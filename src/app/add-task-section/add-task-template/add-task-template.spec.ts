import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskTemplate } from './add-task-template';

describe('AddTaskTemplate', () => {
  let component: AddTaskTemplate;
  let fixture: ComponentFixture<AddTaskTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
