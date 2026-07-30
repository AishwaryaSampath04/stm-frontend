import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { TaskComponent } from './task/task.component';
import { AuthGuard } from './helpers/auth.guard';
import { NewpasswordComponent } from './newpassword/newpassword.component';
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
const routes: Routes = [  
  {
  path: 'home',
  component: HomeComponent
}, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'task', component: TaskComponent },
 { path: 'newpassword', component: NewpasswordComponent},
{
  path: 'stm',
  component: StmHomeComponent,
  canActivate: [AuthGuard]
},


{
  path: 'add-student',
  component: AddStudentComponent,
  canActivate: [AuthGuard]
},



{
  path: 'fee-payment',
  component: FeePaymentComponent,
  canActivate: [AuthGuard]
},
 /*  { path: '', redirectTo: 'login', pathMatch: 'full' }, */


  {
  path: 'add-teacher',
  component: AddTeacherComponent,
  canActivate: [AuthGuard]
},
 

{
  path: 'teacher-salary',
  component: TeacherSalaryComponent,
  canActivate: [AuthGuard]
},

{
  path: 'teacher-attendance',
  component: TeacherAttendanceComponent,
  canActivate: [AuthGuard]
},


{
  path: 'analytics-dashboard',
  component: AnalyticsDashboardComponent,
  canActivate: [AuthGuard]
},



{
  path: 'add-primary-student',
  component: AddPrimaryStudentComponent,
  canActivate: [AuthGuard]
},




{
  path: 'primary-fee-payment',
  component: PrimaryFeePaymentComponent,
  canActivate: [AuthGuard]
},


{
  path: 'primary-student-balance',
  component: PrimaryStudentBalanceComponent,
  canActivate: [AuthGuard]
},


{
  path: 'add-primary-teacher',
  component: AddPrimaryTeacherComponent,
  canActivate: [AuthGuard]
},


{
  path: 'primary-teacher-attendance',
  component: PrimaryTeacherAttendanceComponent,
  canActivate: [AuthGuard]
},


{
  path: 'primary-teacher-salary',
  component: PrimaryTeacherSalaryComponent,
  canActivate: [AuthGuard]
},

{
  path: 'student-details',
  component: StudentDetailsComponent
},

{
  path: 'primary-student-details',
  component: PrimaryStudentDetailsComponent
},


{
  path: 'marks-entry',
  component: MarksEntryComponent
},


{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
