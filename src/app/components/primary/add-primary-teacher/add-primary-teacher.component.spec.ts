import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrimaryTeacherComponent } from './add-primary-teacher.component';

describe('AddPrimaryTeacherComponent', () => {
  let component: AddPrimaryTeacherComponent;
  let fixture: ComponentFixture<AddPrimaryTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrimaryTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrimaryTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
