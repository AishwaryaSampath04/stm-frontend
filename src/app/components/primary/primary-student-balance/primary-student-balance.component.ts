import { Component, OnInit } from '@angular/core';
import { StmService } from '../../../services/stm.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-primary-student-balance',
  templateUrl: './primary-student-balance.component.html',
  styleUrls: ['./primary-student-balance.component.css']
})
export class PrimaryStudentBalanceComponent implements OnInit {

  balanceList: any[] = [];

  paymentHistory: any = {};

  expandedStudentId: number | null = null;

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {

    this.loadBalance();

  }

  loadBalance(): void {

    this.stmService
      .getPrimaryBalance()
      .subscribe({

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
      .getPrimaryPaymentHistory(studentId)
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

  
sendPrimaryWhatsApp(row: any): void {

  const history = this.paymentHistory[row.student_id] || [];

  let message =
`🏫 *STM ACADEMY*

Dear Parent,

Fee Details of your child.

----------------------------------------

👤 *Student Name:* ${row.student_name}

🎓 *Admission No:* ${row.admission_no}

📚 *Class:* ${row.grade_name}

📱 *Mobile:* ${row.mobile_no}

----------------------------------------

💰 *Fee Summary*

📅 Joining Date : ${row.joining_date}
`;

  if (row.leaving_date) {
    message += `📅 Ending Date : ${row.leaving_date}\n`;
  }

  message += `
💵 Monthly Fee : ₹${row.monthly_fee}

💳 Paid Amount : ₹${row.paid_amount}

💰 Balance Amount : ₹${row.balance_amount}
`;

  if (row.balance_months > 0) {
    message += `📆 Pending Months : ${row.balance_months}\n`;
  }

  if (row.balance_days > 0) {
    message += `⏳ Pending Days : ${row.balance_days}\n`;
  }

  message += `
----------------------------------------

🧾 *Payment History*

`;

  if (history.length > 0) {

    history.forEach((p: any, index: number) => {

      message +=
`${index + 1})

📅 Date : ${p.payment_date}

🧾 Receipt No : ${p.receipt_no}

💳 Mode : ${p.payment_mode}

💵 Amount : ₹${p.amount_paid}

📝 Remarks : ${p.remarks || '-'}

----------------------------------------

`;

    });

  } else {

    message += `No Payment History Available.

`;

  }

  message +=
`═══════════════════════

💰 *AMOUNT PAYABLE*

👉 *₹${row.balance_amount}*

═══════════════════════

Kindly pay the above balance amount at the earliest.

For any clarification, please contact STM Academy.

Thank You.

🏫 *STM ACADEMY*`;

  Swal.fire({

    title: '<i class="fab fa-whatsapp" style="color:#25D366;"></i> Send WhatsApp',

    html: `
      <div style="text-align:left;">
        <p style="font-size:16px;font-weight:600;margin-bottom:10px;">
          The following message will be sent:
        </p>

        <textarea
          readonly
          style="
            width:100%;
            height:350px;
            padding:10px;
            font-size:14px;
            font-family:Arial;
            resize:none;
            border-radius:6px;
          ">${message}</textarea>
      </div>
    `,

    width: '750px',

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
  downloadBalanceSheetExcel(): void {

    const excelData = this.balanceList.map((row: any) => ({

      'Admission No': row.admission_no,

      'Student Name': row.student_name,

      'Parent Name': row.parent_name,

      'Mobile No': row.mobile_no,

      'Grade': row.grade_name,

      'Monthly Fee': row.monthly_fee,

      'Joining Date': row.joining_date,

      'Total Months': row.total_months,

      'Amount Paid': row.paid_amount,

      'Balance Amount': row.balance_amount,

      'Balance Months': row.balance_months

    }));

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook: XLSX.WorkBook = {

      Sheets: {

        'Primary Balance Sheet': worksheet

      },

      SheetNames: [

        'Primary Balance Sheet'

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
      'Primary_Balance_Sheet.xlsx'
    );

  }

  downloadPaymentHistoryExcel(): void {

    this.stmService
      .getAllPrimaryPaymentHistory()
      .subscribe({

        next: (data: any[]) => {

          if (!data || data.length === 0) {

            Swal.fire({

              icon: 'warning',

              title: 'No Payment History',

              text: 'No payment records are available.',

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

            'Monthly Fee': row.monthly_fee,

            'Joining Date': row.joining_date,

            'Total Months': row.total_months,

            'Amount Paid': row.paid_amount,

            'Balance Amount': row.balance_amount,

            'Balance Months': row.balance_months,

            'Receipt No': row.receipt_no,

            'Payment Date': row.payment_date,

            'Payment Mode': row.payment_mode,

            'Remarks': row.remarks,

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
            'Primary_All_Payment_History.xlsx'
          );

        },

        error: (err: any) => {

          console.error(err);

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

}