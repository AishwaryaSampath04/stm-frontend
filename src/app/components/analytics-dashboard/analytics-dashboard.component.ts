import { Component, OnInit } from '@angular/core';
import { StmService } from '../../services/stm.service';

import {
  Chart,
  registerables
} from 'chart.js';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {

  summary: any = {

    totalCollection: 0,

    pendingCollection: 0,

    totalRevenue: 0,

    totalSalaryPaid: 0,

    netProfit: 0,

    studentCount: 0,

    teacherCount: 0

  };
  primarySummary: any = {

    totalCollection: 0,

    pendingCollection: 0,

    totalRevenue: 0,

    totalSalaryPaid: 0,

    netProfit: 0,

    studentCount: 0,

    teacherCount: 0

  };
  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {
  console.log('Analytics Component Loaded');
    Chart.register(...registerables);

    this.loadDashboard();
    this.loadPrimaryDashboard();
  }
 loadPrimaryDashboard(): void {

  console.log(
    'Calling Primary Analytics API...'
  );

  this.stmService
    .getPrimaryAnalyticsDashboard()
    .subscribe({

      next: (data: any) => {

        console.log(
          'Primary API Response:',
          data
        );

        this.primarySummary = {

          totalCollection:
            data.total_collection || 0,

          pendingCollection:
            data.pending_collection || 0,

          totalRevenue:
            data.total_revenue || 0,

          totalSalaryPaid:
            data.total_salary_paid || 0,

          studentCount:
            data.student_count || 0,

          teacherCount:
            data.teacher_count || 0,

          netProfit:
            (data.total_revenue || 0)
            -
            (data.total_salary_paid || 0)

        };

        console.log(
          'Primary Summary:',
          this.primarySummary
        );

        setTimeout(() => {

          console.log(
            'Drawing Primary Charts...'
          );

          this.loadPrimaryFeePieChart();

          this.loadPrimaryFinanceChart();

        }, 500);

      },

      error: (err: any) => {

        console.error(
          'Primary Analytics Error:',
          err
        );

      }

    });

}
  loadDashboard(): void {

    this.stmService
      .getAnalyticsDashboard()
      .subscribe({

        next: (data: any) => {

          console.log('Dashboard Data:', data);

          this.summary = {

            totalCollection:
              data.total_collection || 0,

            pendingCollection:
              data.pending_collection || 0,

            totalRevenue:
              data.total_revenue || 0,

            totalSalaryPaid:
              data.total_salary_paid || 0,

            studentCount:
              data.student_count || 0,

            teacherCount:
              data.teacher_count || 0,

            netProfit:
              (data.total_revenue || 0) -
              (data.total_salary_paid || 0)

          };

          console.log(
            'Mapped Summary:',
            this.summary
          );

          setTimeout(() => {

            this.loadFeePieChart();

            this.loadFinanceChart();

          }, 200);

        },

        error: (err: any) => {

          console.error(err);

          alert('Error loading dashboard data');

        }

      });

  }

  loadFeePieChart(): void {

    console.log(
      'Pie Chart Data:',
      this.summary.totalCollection,
      this.summary.pendingCollection
    );

    const existingChart =
      Chart.getChart('feePieChart');

    if (existingChart) {

      existingChart.destroy();

    }

    new Chart('feePieChart', {

      type: 'pie',

      data: {

        labels: [

          'Collected Fees',

          'Pending Fees'

        ],

        datasets: [

          {

            data: [

              this.summary.totalCollection,

              this.summary.pendingCollection

            ],

            backgroundColor: [

              '#198754',

              '#ffc107'

            ],

            borderWidth: 1

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {

            position: 'bottom'

          }

        }

      }

    });

  }

  loadFinanceChart(): void {

    console.log(
      'Finance Chart Data:',
      this.summary.totalRevenue,
      this.summary.totalSalaryPaid,
      this.summary.netProfit
    );

    const existingChart =
      Chart.getChart('financeChart');

    if (existingChart) {

      existingChart.destroy();

    }

    new Chart('financeChart', {

      type: 'bar',

      data: {

        labels: [

          'Revenue',

          'Salary Paid',

          'Net Profit'

        ],

        datasets: [

          {

            label: 'Amount',

            data: [

              this.summary.totalRevenue,

              this.summary.totalSalaryPaid,

              this.summary.netProfit

            ],

            backgroundColor: [

              '#0d6efd',

              '#dc3545',

              '#198754'

            ]

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {

            display: false

          }

        },

        scales: {

          y: {

            beginAtZero: true

          }

        }

      }

    });

  }
  loadPrimaryFeePieChart(): void {

    const existingChart =
      Chart.getChart(
        'primaryFeePieChart'
      );

    if (existingChart) {

      existingChart.destroy();

    }

    new Chart(
      'primaryFeePieChart',
      {

        type: 'pie',

        data: {

          labels: [

            'Collected Fees',

            'Pending Fees'

          ],

          datasets: [

            {

              data: [

                this.primarySummary.totalCollection,

                this.primarySummary.pendingCollection

              ],

              backgroundColor: [

                '#198754',

                '#ffc107'

              ]

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false

        }

      }

    );

  }



  loadPrimaryFinanceChart(): void {

    const existingChart =
      Chart.getChart(
        'primaryFinanceChart'
      );

    if (existingChart) {

      existingChart.destroy();

    }

    new Chart(
      'primaryFinanceChart',
      {

        type: 'bar',

        data: {

          labels: [

            'Revenue',

            'Salary Paid',

            'Net Profit'

          ],

          datasets: [

            {

              label: 'Amount',

              data: [

                this.primarySummary.totalRevenue,

                this.primarySummary.totalSalaryPaid,

                this.primarySummary.netProfit

              ],

              backgroundColor: [

                '#0d6efd',

                '#dc3545',

                '#198754'

              ]

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {

              display: false

            }

          },

          scales: {

            y: {

              beginAtZero: true

            }

          }

        }

      }

    );

  }
  
}