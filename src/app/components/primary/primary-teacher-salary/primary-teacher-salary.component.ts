import { Component, OnInit } from '@angular/core';
import { StmService } from '../../../services/stm.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-primary-teacher-salary',
  templateUrl: './primary-teacher-salary.component.html',
  styleUrls: ['./primary-teacher-salary.component.css']
})
export class PrimaryTeacherSalaryComponent implements OnInit {

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
      .getPrimaryTeacherSalaryData(
        this.selectedMonth,
        this.selectedYear
      )
      .subscribe({

        next: (data: any[]) => {

          this.teachers = data;

          this.teachers.forEach(row => {

            row.lossOfPayDays = row.loss_of_pay_days ?? 0;
            row.extraPay = row.extra_pay ?? 0;
            row.comments = row.comments ?? '';
            row.payableSalary = row.payable_salary ?? row.monthly_salary;
          });

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

 calculateSalary(
  row: any
): void {

  if (
    !row.working_days ||
    row.working_days <= 0
  ) {

    row.payableSalary =
      row.monthly_salary +
      (Number(row.extraPay) || 0);

    return;

  }

  const perDay =

    row.monthly_salary /

    row.working_days;

  const lopDeduction =

    (row.lossOfPayDays || 0) *

    perDay;

  row.payableSalary =

    row.monthly_salary -

    lopDeduction +

    (Number(row.extraPay) || 0);

}
  confirmProcessSalary(row: any): void {

    Swal.fire({

      title: 'Are you sure?',

      text: 'Do you want to make this payment?',

      icon: 'warning',

      width: '560px',

      showCloseButton: true,

      showCancelButton: true,

      confirmButtonText: 'Yes',

      cancelButtonText: 'No',

      reverseButtons: true

    }).then((result) => {

      if (result.isConfirmed) {

        this.processSalary(row);

      }

    });

  }

processSalary(
  row: any
): void {

  const payload = {

    teacherId:
      row.teacher_id,

    paymentMonth:
      this.selectedMonth,

    paymentYear:
      this.selectedYear,

    workingDays:
      row.working_days,

    presentDays:
      row.present_days,

    absentDays:
      row.absent_days,

    lossOfPayDays:
      row.lossOfPayDays,

    fixedSalary:
      row.monthly_salary,

    extraPay:
      row.extraPay,

    comments:
      row.comments,

    payableSalary:
      row.payableSalary

  };

  console.log("Primary Teacher Salary Payload:", payload);

  this.stmService
    .processPrimaryTeacherSalary(payload)
    .subscribe({

      next: (response: string) => {

        console.log(response);

        Swal.fire({

          icon: 'success',

          title: 'Salary Processed',

          text: 'Teacher salary has been processed successfully.',

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

          title: 'Processing Failed',

          text: err?.error || 'Teacher salary could not be processed.',

          width: '560px',

          showCloseButton: true,

          confirmButtonText: 'OK'

        });

      }

    });

}
}