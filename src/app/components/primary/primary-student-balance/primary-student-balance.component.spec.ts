import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryStudentBalanceComponent } from './primary-student-balance.component';

describe('PrimaryStudentBalanceComponent', () => {
  let component: PrimaryStudentBalanceComponent;
  let fixture: ComponentFixture<PrimaryStudentBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryStudentBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryStudentBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
