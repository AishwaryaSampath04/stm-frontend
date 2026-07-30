import { Component, OnInit } from '@angular/core';
import { StmService } from '../../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-primary-student-details',
  templateUrl: './primary-student-details.component.html',
  styleUrls: ['./primary-student-details.component.css']
})
export class PrimaryStudentDetailsComponent implements OnInit {

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

    monthly_fee: '',

    active_flag: 'Y',

    joining_date: '',

    leaving_date: ''

  };

  originalStudent: any = {};

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {

    this.loadGrades();

    this.loadStudents();

  }

  loadGrades(): void {

    this.stmService
      .getPrimaryGrades()
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
      .getPrimaryStudentDetails()
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

    this.originalStudent = {

      ...student

    };

    this.showEditPopup = true;

  }

  closePopup(): void {

    this.showEditPopup = false;

  }

  hasChanges(): boolean {

    return JSON.stringify(this.selectedStudent) !==
      JSON.stringify(this.originalStudent);

  }

  onStatusChange(): void {

    if (this.selectedStudent.active_flag === 'Y') {

      this.selectedStudent.leaving_date = null;

    }

  }

  confirmUpdateStudent(): void {

    Swal.fire({

      title: 'Are you sure?',

      text: 'Do you want to update this student?',

      icon: 'warning',

      width: '560px',

      showCloseButton: true,

      showCancelButton: true,

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
      .updatePrimaryStudent(
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