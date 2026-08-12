import { Component, OnInit } from '@angular/core';
import { StmService } from '../../services/stm.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stm-home',
  templateUrl: './stm-home.component.html',
  styleUrls: ['./stm-home.component.css']
})
export class StmHomeComponent implements OnInit {

  balanceList: any[] = [];

  paymentHistory: any = {};
  expandedStudentId: number | null = null;

  constructor(private stmService: StmService,private router: Router) { }

  ngOnInit(): void {


    this.loadBalance();
  }

  loadBalance(): void {

    this.stmService.getBalance().subscribe({
      next: (data: any[]) => {
        this.balanceList = data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });

  }

  loadPaymentHistory(studentId: number): void {

    if (this.paymentHistory[studentId]) {
      return;
    }

    this.stmService
      .getPaymentHistory(studentId)
      .subscribe({
        next: (data: any[]) => {

          this.paymentHistory[studentId] = data;

        },
        error: (err: any) => {

          console.error(err);

        }
      });

  }



  toggleHistory(studentId: number): void {

  if (this.expandedStudentId === studentId) {

    this.expandedStudentId = null;

  } else {

    this.expandedStudentId = studentId;

    this.loadPaymentHistory(studentId);

  }

}

downloadBalanceSheetExcel(): void {

  const excelData = this.balanceList.map((row: any) => ({

    'Admission No': row.admission_no,

    'Student Name': row.student_name,

    'Mobile No': row.mobile_no,

    'Grade': row.grade_name,

    'Annual Fee': row.annual_fee,

    'Discount': row.discount_amount,

    'Final Fee': row.final_fee,

    'Amount Paid': row.amount_paid,

    'Balance Amount': row.balance_amount

  }));

  const worksheet: XLSX.WorkSheet =
    XLSX.utils.json_to_sheet(excelData);

  const workbook: XLSX.WorkBook = {
    Sheets: {
      'High School Balance Sheet': worksheet
    },
    SheetNames: [
      'High School Balance Sheet'
    ]
  };

  const excelBuffer: any =
    XLSX.write(
      workbook,
      {
        bookType: 'xlsx',
        type: 'array'
      }
    );

  const file = new Blob(
    [excelBuffer],
    {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  );

  saveAs(
    file,
    'High_School_Balance_Sheet.xlsx'
  );

}





downloadPaymentHistoryExcel(): void {

  this.stmService
    .getAllPaymentHistory()
    .subscribe({

      next: (data: any[]) => {

        if (!data || data.length === 0) {

          Swal.fire({
            icon: 'warning',
            title: 'No Payment History',
            text: 'No fee payment records are available.',
            width: '650px',
            showCloseButton: true,
            confirmButtonText: 'OK'
          });

          return;

        }

        const excelData = data.map((row: any) => ({

          'Admission No': row.admission_no,

          'Student Name': row.student_name,

          'Parent Name': row.parent_name,

          'Mobile No': row.mobile_no,

          'Grade': row.grade_name,

          'Annual Fee': row.annual_fee,

          'Discount': row.discount_amount,

          'Final Fee': row.final_fee,

          'Total Amount Paid': row.total_amount_paid,

          'Balance Amount': row.balance_amount,

          'Receipt No': row.receipt_no,

          'Payment Date': row.payment_date,

          'Payment Mode': row.payment_mode,

          'Payment Amount': row.payment_amount

        }));

        const worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(excelData);

        const workbook: XLSX.WorkBook = {
          Sheets: {
            'Payment History': worksheet
          },
          SheetNames: [
            'Payment History'
          ]
        };

        const excelBuffer: any =
          XLSX.write(
            workbook,
            {
              bookType: 'xlsx',
              type: 'array'
            }
          );

        const file = new Blob(
          [excelBuffer],
          {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        );

        saveAs(
          file,
          'High_School_All_Payment_History.xlsx'
        );

      },

      error: (err: any) => {

        console.error('Error loading all payment history:', err);

        Swal.fire({
          icon: 'error',
          title: 'Download Failed',
          text: 'Could not load payment history.',
          width: '650px',
          showCloseButton: true,
          confirmButtonText: 'OK'
        });

      }

    });

}



sendWhatsApp(row: any) {

  const history = this.paymentHistory[row.student_id] || [];

  let message =
`🏫 *SPUR ACADEMY*

Dear Parent,

Fee Details of your child.

----------------------------------------

👤 *Student Name:* ${row.student_name}

🎓 *Admission No:* ${row.admission_no}

📚 *Class:* ${row.grade_name}

📱 *Mobile:* ${row.mobile_no}

----------------------------------------

💰 *Fee Summary*

Total Fee : ₹${row.final_fee}

Paid Amount : ₹${row.paid_amount}

Balance : ₹${row.balance_amount}

----------------------------------------

🧾 *Payment History*

`;

  if (history.length > 0) {

    history.forEach((p: any, index: number) => {

      message +=
`${index + 1})

📅 Date : ${p.payment_date}

🧾 Receipt : ${p.receipt_no}

💳 Mode : ${p.payment_mode}

💵 Amount : ₹${p.amount_paid}

----------------------------------------

`;

    });

  } else {

    message += `No Payment History Available.\n\n`;

  }
message +=
`═══════════════════════

💰 *AMOUNT PAYABLE*

👉 *Balance Amount: ₹${row.balance_amount}*

═══════════════════════

Kindly pay the above balance amount at the earliest to avoid any inconvenience.

For any clarification, please contact the SPUR ACADEMY office.

Thank You.

🏫 *SPUR ACADEMY*`;

  Swal.fire({

    title: '<i class="fab fa-whatsapp" style="color:#25D366;"></i> Send WhatsApp',

    html: `
      <div style="text-align:left;">
        <p style="font-size:16px;font-weight:600;">
          The following message will be sent:
        </p>

        <textarea
          readonly
          style="
            width:100%;
            height:300px;
            font-size:14px;
            padding:10px;
            resize:none;
            font-family:Arial;
          ">${message}</textarea>
      </div>
    `,

    width: '700px',

    icon: 'question',

    showCancelButton: true,

    showCloseButton: true,

    confirmButtonText: '<i class="fab fa-whatsapp"></i> Send',

    cancelButtonText: 'Cancel',

    reverseButtons: true

  }).then((result) => {

    if (result.isConfirmed) {

      const phone = '91' + row.mobile_no;

      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        '_blank'
      );

    }

  });

}
}