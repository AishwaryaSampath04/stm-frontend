import { Component, OnInit } from '@angular/core';
import { StmService } from '../../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-primary-student',
  templateUrl: './add-primary-student.component.html',
  styleUrls: ['./add-primary-student.component.css']
})
export class AddPrimaryStudentComponent implements OnInit {

  grades: any[] = [];

  student: any = {
    admissionNo: '',
    studentName: '',
    gradeId: '',
    parentName: '',
    mobileNo: '',
    monthlyFee: '',
    joiningDate: '',
    activeFlag: 'Y'
  };

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {

    this.stmService
      .getPrimaryGrades()
      .subscribe({
        next: (data: any[]) => {
          this.grades = data;
        },
        error: (err: any) => {
          console.error('Error loading grades:', err);
        }
      });

  }

  isStudentFormValid(): boolean {

    return !!(
      this.student.admissionNo?.trim() &&
      this.student.studentName?.trim() &&
      this.student.gradeId &&
      this.student.parentName?.trim() &&
      /^[0-9]{10}$/.test(this.student.mobileNo) &&
      Number(this.student.monthlyFee) > 0 &&
      this.student.joiningDate
    );

  }

  confirmAndSaveStudent(): void {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save this primary student?',
      icon: 'warning',
      width: '560px',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {

      if (result.isConfirmed) {
        this.saveStudent();
      }

    });

  }

  saveStudent(): void {

    this.stmService
      .addPrimaryStudent(this.student)
      .subscribe({

        next: (response: string) => {

          console.log('Primary student saved successfully:', response);

          Swal.fire({
            icon: 'success',
            title: 'Saved Successfully',
            text: 'Primary student data has been saved successfully.',
            width: '560px',
            showCloseButton: true,
            confirmButtonText: 'OK'
          }).then(() => {

            this.resetStudentForm();

          });

        },

        error: (err: any) => {

          console.error('Error while saving primary student:', err);

          Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text: err?.error || 'Primary student data could not be saved.',
            width: '560px',
            showCloseButton: true,
            confirmButtonText: 'OK'
          });

        }

      });

  }

  resetStudentForm(): void {

    this.student = {
      admissionNo: '',
      studentName: '',
      gradeId: '',
      parentName: '',
      mobileNo: '',
      monthlyFee: '',
      joiningDate: '',
      activeFlag: 'Y'
    };

  }
onMobileInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, '');
}

onNameInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
}
}