import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryTeacherSalaryComponent } from './primary-teacher-salary.component';

describe('PrimaryTeacherSalaryComponent', () => {
  let component: PrimaryTeacherSalaryComponent;
  let fixture: ComponentFixture<PrimaryTeacherSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryTeacherSalaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryTeacherSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
