import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryStudentDetailsComponent } from './primary-student-details.component';

describe('PrimaryStudentDetailsComponent', () => {
  let component: PrimaryStudentDetailsComponent;
  let fixture: ComponentFixture<PrimaryStudentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryStudentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryStudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
