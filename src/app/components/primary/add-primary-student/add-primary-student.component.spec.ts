import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrimaryStudentComponent } from './add-primary-student.component';

describe('AddPrimaryStudentComponent', () => {
  let component: AddPrimaryStudentComponent;
  let fixture: ComponentFixture<AddPrimaryStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrimaryStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrimaryStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
