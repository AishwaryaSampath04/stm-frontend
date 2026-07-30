import { Component, OnInit } from '@angular/core';
import { StmService } from '../../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-primary-fee-payment',
  templateUrl: './primary-fee-payment.component.html',
  styleUrls: ['./primary-fee-payment.component.css']
})
export class PrimaryFeePaymentComponent implements OnInit {

  grades: any[] = [];
  amountInWords: string = '';
  students: any[] = [];

  selectedGrade = '';

  payment: any = {

    studentId: '',

    receiptNo: '',

    amount: '',

    paymentMode: 'Cash',

    remarks: ''

  };

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {

    this.loadGrades();

  }






  updateAmountInWords(): void {

    const amount = Number(this.payment.amount);

    if (!amount || amount <= 0) {
      this.amountInWords = '';
      return;
    }

    this.amountInWords = this.numberToWords(amount) + ' Rupees Only';
  }



  numberToWords(num: number): string {

    if (num === 0) return 'Zero';

    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
      'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty',
      'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const convert = (n: number): string => {

      if (n < 20) return ones[n];

      if (n < 100)
        return tens[Math.floor(n / 10)] +
          (n % 10 ? ' ' + ones[n % 10] : '');

      if (n < 1000)
        return ones[Math.floor(n / 100)] +
          ' Hundred' +
          (n % 100 ? ' ' + convert(n % 100) : '');

      if (n < 100000)
        return convert(Math.floor(n / 1000)) +
          ' Thousand' +
          (n % 1000 ? ' ' + convert(n % 1000) : '');

      if (n < 10000000)
        return convert(Math.floor(n / 100000)) +
          ' Lakh' +
          (n % 100000 ? ' ' + convert(n % 100000) : '');

      return convert(Math.floor(n / 10000000)) +
        ' Crore' +
        (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };

    return convert(num);
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

  onGradeChange(): void {

    this.payment.studentId = '';

    this.students = [];

    if (!this.selectedGrade) {

      return;

    }

    this.stmService
      .getPrimaryStudentsByGrade(
        Number(this.selectedGrade)
      )
      .subscribe({

        next: (data: any[]) => {

          this.students = data;

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  confirmAndSavePayment(): void {

    Swal.fire({

      title: 'Are you sure?',

      text: 'Do you want to save this fee payment?',

      icon: 'warning',

      width: '560px',

      showCloseButton: true,

      showCancelButton: true,

      confirmButtonText: 'Yes',

      cancelButtonText: 'No',

      reverseButtons: true

    }).then((result) => {

      if (result.isConfirmed) {

        this.savePayment();

      }

    });

  }

  savePayment(): void {

    this.stmService
      .addPrimaryPayment(this.payment)
      .subscribe({

        next: (response: string) => {

          console.log(response);

          Swal.fire({

            icon: 'success',

            title: 'Saved Successfully',

            text: 'Primary fee payment has been saved successfully.',

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          }).then(() => {

            this.selectedGrade = '';

            this.students = [];

            this.payment = {

              studentId: '',

              receiptNo: '',

              amount: '',

              paymentMode: 'Cash',

              remarks: ''

            };

          });

        },

        error: (err: any) => {

          console.error(err);

          Swal.fire({

            icon: 'error',

            title: 'Save Failed',

            text: err?.error || 'Error while saving payment.',

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          });

        }

      });

  }

}