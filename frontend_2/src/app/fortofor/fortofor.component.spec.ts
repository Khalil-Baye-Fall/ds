import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FortoforComponent } from './fortofor.component';

describe('FortoforComponent', () => {
  let component: FortoforComponent;
  let fixture: ComponentFixture<FortoforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FortoforComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FortoforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
