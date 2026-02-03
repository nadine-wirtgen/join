import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDialogTemplate } from './contact-dialog-template';

describe('ContactDialogTemplate', () => {
  let component: ContactDialogTemplate;
  let fixture: ComponentFixture<ContactDialogTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDialogTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactDialogTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
