import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Square } from './square';

describe('Square', () => {
  let component: Square;
  let fixture: ComponentFixture<Square>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Square]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Square);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
