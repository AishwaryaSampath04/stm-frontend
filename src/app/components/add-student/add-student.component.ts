import { Component } from '@angular/core';
import { StmService } from '../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {
  students: any[] = [];
  grades: any[] = [];
  selectedGrade = '';
  student: any = {

    admissionNo: '',

    studentName: '',

    parentName: '',

    mobileNo: '',

    gradeId: '',

    annualFee: 0,

    discountAmount: 0,

    finalFee: 0,

    joiningDate: '',

    activeFlag: 'Y'

  };

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {
    this.loadGrades();
  }
  confirmAndSaveStudent(): void {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save this student?',
      icon: 'warning',
      width: '560px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      customClass: {
        popup: 'stm-swal-popup',
        title: 'stm-swal-title',
        htmlContainer: 'stm-swal-text',
        confirmButton: 'stm-swal-confirm-btn',
        cancelButton: 'stm-swal-cancel-btn'
      }
    }).then((result) => {

      if (result.isConfirmed) {

        this.saveStudent();

      }

    });

  }

  loadGrades(): void {

    this.stmService.getGrades()
      .subscribe((data: any) => {
        this.grades = data;
      });

  }


  saveStudent(): void {

    this.stmService
      .addStudent(this.student)
      .subscribe({

        next: (response: string) => {

          console.log('Student saved successfully:', response);

          Swal.fire({
            icon: 'success',
            title: 'Saved Successfully',
            text: 'Student data has been saved successfully.',
            width: '560px',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'stm-swal-popup',
              title: 'stm-swal-title',
              htmlContainer: 'stm-swal-text',
              confirmButton: 'stm-swal-confirm-btn'
            }
          });

          this.student = {

            admissionNo: '',

            studentName: '',

            parentName: '',

            mobileNo: '',

            gradeId: '',

            annualFee: 0,

            discountAmount: 0,

            finalFee: 0,
            joiningDate: '',

            activeFlag: 'Y'
          };

        },

        error: (err: any) => {

          console.error('Error while saving student:', err);

          Swal.fire({
            icon: 'error',
            title: 'Save Failed',
            text: 'Student data could not be saved.',
            width: '560px',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'stm-swal-popup',
              title: 'stm-swal-title',
              htmlContainer: 'stm-swal-text',
              confirmButton: 'stm-swal-confirm-btn'
            }
          });

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

      Number(this.student.annualFee) > 0 &&

      this.student.joiningDate

    );

  }
  calculateFinalFee(): void {

    const annualFee =
      Number(this.student.annualFee || 0);

    const discount =
      Number(this.student.discountAmount || 0);

    this.student.finalFee =
      Math.max(annualFee - discount, 0);

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