import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StmHomeComponent } from './stm-home.component';

describe('StmHomeComponent', () => {
  let component: StmHomeComponent;
  let fixture: ComponentFixture<StmHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StmHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StmHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
