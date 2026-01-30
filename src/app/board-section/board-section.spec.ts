import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSection } from './board-section';

describe('BoardSection', () => {
  let component: BoardSection;
  let fixture: ComponentFixture<BoardSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
