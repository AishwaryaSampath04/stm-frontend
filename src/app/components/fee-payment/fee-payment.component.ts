import { Component, OnInit } from '@angular/core';
import { StmService } from '../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fee-payment',
  templateUrl: './fee-payment.component.html',
  styleUrls: ['./fee-payment.component.css']
})
export class FeePaymentComponent implements OnInit {
  today: string = new Date().toISOString().substring(0, 10);
  students: any[] = [];
  grades: any[] = [];



  selectedGrade = '';
amountInWords: string = '';
  payment = {
    studentId: '',
    amount: '',

    receiptNo: '',
    paymentMode: 'Cash',


    
  };

  constructor(private stmService: StmService) { }

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {

    this.stmService.getGrades()
      .subscribe((data: any) => {
        this.grades = data;
      });

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


  onGradeChange(): void {

    if (!this.selectedGrade) {
      this.students = [];
      return;
    }

    this.stmService
      .getStudentsByGrade(Number(this.selectedGrade))
      .subscribe((data: any) => {

        this.students = data;

      });

  }


  confirmSaveFeePayment(): void {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save this fee payment?',
      icon: 'warning',
      width: '650px',
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
    .addPayment(this.payment)
    .subscribe({

      next: (response: string) => {

        console.log('Payment saved successfully:', response);

        Swal.fire({
          icon: 'success',
          title: 'Saved Successfully',
          text: 'Fee payment has been saved successfully.',
          width: '650px',
          showCloseButton: true,
          confirmButtonText: 'OK'
        });

        this.payment = {

          studentId: '',

          amount: '',

          receiptNo: '',

          paymentMode: ''

        };

        this.selectedGrade = '';

        this.students = [];

      },

      error: (err: any) => {

        console.error('Error while saving payment:', err);

        let errorMessage =
          'Fee payment could not be saved.';

        if (
          err?.error?.includes(
            'duplicate key'
          )
        ) {

          errorMessage =
            'Receipt Number already exists. Please enter a different Receipt Number.';

        }

        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: errorMessage,
          width: '650px',
          showCloseButton: true,
          confirmButtonText: 'OK'
        });

      }

    });

}
}