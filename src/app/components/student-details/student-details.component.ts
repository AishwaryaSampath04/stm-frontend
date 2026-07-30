import { Component, OnInit } from '@angular/core';
import { StmService } from '../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {

  students: any[] = [];

  grades: any[] = [];

  showEditPopup = false;

  selectedStudent: any = {

    student_id: '',

    admission_no: '',

    student_name: '',

    parent_name: '',

    mobile_no: '',

    grade_id: '',

    annual_fee: '',

    discount_amount: '',

    final_fee: '',

    active_flag: 'Y',

    joining_date: '',

    leaving_date: ''

  };

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {

    this.loadGrades();

    this.loadStudents();

  }

  loadGrades(): void {

    this.stmService
      .getGrades()
      .subscribe({

        next: (data: any[]) => {

          this.grades = data;

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  loadStudents(): void {

    this.stmService
      .getStudentDetails()
      .subscribe({

        next: (data: any[]) => {

          this.students = data;

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  editStudent(student: any): void {

    this.selectedStudent = {

      ...student

    };

    this.showEditPopup = true;

  }

  closePopup(): void {

    this.showEditPopup = false;

  }

  calculateFinalFee(): void {

    const annualFee =

      Number(this.selectedStudent.annual_fee || 0);

    const discount =

      Number(this.selectedStudent.discount_amount || 0);

    this.selectedStudent.final_fee =

      annualFee - discount;

    if (this.selectedStudent.final_fee < 0) {

      this.selectedStudent.final_fee = 0;

    }

  }

  confirmUpdateStudent(): void {
console.log("button is clicked");
    Swal.fire({

      title: 'Are you sure?',

      text: 'Do you want to update this student?',

      icon: 'warning',

      width: '560px',

      showCancelButton: true,

      showCloseButton: true,

      confirmButtonText: 'Yes',

      cancelButtonText: 'No',

      reverseButtons: true

    }).then((result) => {

      if (result.isConfirmed) {

        this.updateStudent();

      }

    });

  }

  updateStudent(): void {

    this.stmService
      .updateStudent(
        this.selectedStudent
      )
      .subscribe({

        next: (response: string) => {

          Swal.fire({

            icon: 'success',

            title: 'Updated Successfully',

            text: response,

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          }).then(() => {

            this.showEditPopup = false;

            this.loadStudents();

          });

        },

        error: (err: any) => {

          console.error(err);

          Swal.fire({

            icon: 'error',

            title: 'Update Failed',

            text:
              err?.error ||
              'Unable to update student.',

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          });

        }

      });

  }

}