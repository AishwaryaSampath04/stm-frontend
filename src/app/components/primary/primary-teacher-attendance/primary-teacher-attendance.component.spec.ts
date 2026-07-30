import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryTeacherAttendanceComponent } from './primary-teacher-attendance.component';

describe('PrimaryTeacherAttendanceComponent', () => {
  let component: PrimaryTeacherAttendanceComponent;
  let fixture: ComponentFixture<PrimaryTeacherAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryTeacherAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryTeacherAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
