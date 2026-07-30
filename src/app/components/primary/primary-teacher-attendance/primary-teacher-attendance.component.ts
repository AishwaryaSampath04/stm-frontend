import { Component, OnInit } from '@angular/core';
import { StmService } from '../../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-primary-teacher-attendance',
  templateUrl: './primary-teacher-attendance.component.html',
  styleUrls: ['./primary-teacher-attendance.component.css']
})
export class PrimaryTeacherAttendanceComponent implements OnInit {

  teachers: any[] = [];

  selectedMonth: number =
    new Date().getMonth() + 1;

  selectedYear: number =
    new Date().getFullYear();

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {

    this.loadTeachers();

  }

  loadTeachers(): void {

    this.stmService
      .getPrimaryTeacherAttendanceData(
        this.selectedMonth,
        this.selectedYear
      )
      .subscribe({

        next: (data: any[]) => {

          this.teachers = data;

        },

        error: (err: any) => {

          console.error(err);

          Swal.fire({

            icon: 'error',

            title: 'Load Failed',

            text: 'Error loading attendance data.',

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          });

        }

      });

  }

  calculateAbsent(
    row: any
  ): void {

    const working =
      Number(row.working_days || 0);

    const present =
      Number(row.present_days || 0);

    row.absent_days =
      Math.max(
        working - present,
        0
      );

  }

  confirmSaveAttendance(row: any): void {

    Swal.fire({

      title: 'Are you sure?',

      text: 'Do you want to save this attendance?',

      icon: 'warning',

      width: '560px',

      showCloseButton: true,

      showCancelButton: true,

      confirmButtonText: 'Yes',

      cancelButtonText: 'No',

      reverseButtons: true

    }).then((result) => {

      if (result.isConfirmed) {

        this.saveAttendance(row);

      }

    });

  }

  saveAttendance(
    row: any
  ): void {

    if (
      !row.working_days ||
      row.working_days <= 0
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Validation',

        text: 'Please enter Working Days.',

        width: '560px',

        showCloseButton: true,

        confirmButtonText: 'OK'

      });

      return;

    }

    if (
      row.present_days == null ||
      row.present_days < 0
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Validation',

        text: 'Please enter Present Days.',

        width: '560px',

        showCloseButton: true,

        confirmButtonText: 'OK'

      });

      return;

    }

    if (
      Number(row.present_days) >
      Number(row.working_days)
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Validation',

        text: 'Present Days cannot be greater than Working Days.',

        width: '560px',

        showCloseButton: true,

        confirmButtonText: 'OK'

      });

      return;

    }

    const payload = {

      teacherId:
        row.teacher_id,

      month:
        this.selectedMonth,

      year:
        this.selectedYear,

      workingDays:
        row.working_days,

      presentDays:
        row.present_days,

      absentDays:
        row.absent_days

    };

    this.stmService
      .savePrimaryAttendance(
        payload
      )
      .subscribe({

        next: (response: string) => {

          console.log(response);

          Swal.fire({

            icon: 'success',

            title: 'Saved Successfully',

            text: 'Teacher attendance has been saved successfully.',

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          }).then(() => {

            this.loadTeachers();

          });

        },

        error: (err: any) => {

          console.error(err);

          Swal.fire({

            icon: 'error',

            title: 'Save Failed',

            text: err?.error || 'Teacher attendance could not be saved.',

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          });

        }

      });

  }

}