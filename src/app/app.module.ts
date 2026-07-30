import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';

import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { SortDirective } from './directive/sort.directive';
import { TaskComponent } from './task/task.component';

// 🔥 Translate imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NewpasswordComponent } from './newpassword/newpassword.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';



import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { StmHomeComponent } from './components/stm-home/stm-home.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { FeePaymentComponent } from './components/fee-payment/fee-payment.component';
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { TeacherSalaryComponent } from './components/teacher-salary/teacher-salary.component';
import { TeacherAttendanceComponent } from './components/teacher-attendance/teacher-attendance.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { AddPrimaryStudentComponent } from './components/primary/add-primary-student/add-primary-student.component';
import { PrimaryFeePaymentComponent } from './components/primary/primary-fee-payment/primary-fee-payment.component';
import { PrimaryStudentBalanceComponent } from './components/primary/primary-student-balance/primary-student-balance.component';
import { AddPrimaryTeacherComponent } from './components/primary/add-primary-teacher/add-primary-teacher.component';
import { PrimaryTeacherAttendanceComponent } from './components/primary/primary-teacher-attendance/primary-teacher-attendance.component';
import { PrimaryTeacherSalaryComponent } from './components/primary/primary-teacher-salary/primary-teacher-salary.component';

import { StudentDetailsComponent } from './components/student-details/student-details.component';
import { PrimaryStudentDetailsComponent } from './components/primary/primary-student-details/primary-student-details.component';
import { MarksEntryComponent } from './components/marks-entry/marks-entry.component';
import { HomeComponent } from './components/home/home.component';








// 🔥 Required loader function
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations:
  
  [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TaskComponent,
    SortDirective,
    NewpasswordComponent,
    StmHomeComponent,
    AddStudentComponent,
    FeePaymentComponent,
    AddTeacherComponent,
    TeacherSalaryComponent,
    TeacherAttendanceComponent,
    AnalyticsDashboardComponent,
    AddPrimaryStudentComponent,
    PrimaryFeePaymentComponent,
    PrimaryStudentBalanceComponent,
    AddPrimaryTeacherComponent,
    PrimaryTeacherAttendanceComponent,
    PrimaryTeacherSalaryComponent,

    StudentDetailsComponent,
     PrimaryStudentDetailsComponent,
     MarksEntryComponent,
     HomeComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatChipsModule,
    FormsModule,

    // ✅ Add TranslateModule here
     TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
       defaultLanguage: 'English'
    }) 
   /*  TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), */

  ],
  providers: [authInterceptorProviders,   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
