import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StmService {

  private apiUrl = 'http://localhost:8080/api/stm';

  constructor(private http: HttpClient) { }



  getBalance(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/balance`
    );
  }

  // ============================================================================
  //                         INSERT STUDENT - HIGH SCHOOL
  // ============================================================================

  addStudent(student: any): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/student`,
      student,
      {
        responseType: 'text'
      }
    );

  }

  // ============================================================================
  //                         INSERT TEACHER - HIGH SCHOOL
  // ============================================================================
  getSubjects() {
    return this.http.get<any[]>(
      `${this.apiUrl}/subjects`
    );
  }
  // ============================================================================
  //                         GET SUBJECTS - HIGH SCHOOL
  // ============================================================================
  addTeacher(teacher: any) {
    return this.http.post(
      `${this.apiUrl}/teacher`,
      teacher,
      {
        responseType: 'text'
      }
    );
  }
  // ============================================================================
  //                         INSERT FEE PAYMENT - HIGH SCHOOL
  // ============================================================================
  addPayment(payment: any): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/payment`,
      payment,
      {
        responseType: 'text'
      }
    );

  }
  // ============================================================================
  //                         GET GRADES - HIGH SCHOOL
  // ============================================================================
  getGrades() {
    return this.http.get<any[]>(
      `${this.apiUrl}/grades`
    );
  }

  // ============================================================================
  //                         GET GRADES - PRIMARY
  // ============================================================================
  getPrimaryGrades() {

    return this.http.get<any[]>(
      `${this.apiUrl}/primary-grades`
    );

  }
  // ============================================================================
  //                         GET STUDENTS BY GRADE - HIGH SCHOOL
  // ============================================================================
  getStudentsByGrade(gradeId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/students/grade/${gradeId}`
    );
  }

  // ============================================================================
  //                      GET PAYMENT BY HISTORY - HIGH SCHOOL SHOW IN UI
  // ============================================================================
  getPaymentHistory(studentId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/payments/student/${studentId}`
    );
  }
  // ============================================================================
  //                   GET  ALL PAYMENT HISTORY - HIGH SCHOOL DOWNLOAD AS EXCEL 
  // ============================================================================
  getAllPaymentHistory() {
    return this.http.get<any[]>(
      `${this.apiUrl}/payments/all`
    );
  }

  // ============================================================================
  //                         GET TEACHER'S ATTENDANCE  - HIGH SCHOOL
  // ============================================================================
  getTeacherAttendanceData(
    month: number,
    year: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/teacher-attendance-data?month=${month}&year=${year}`
    );

  }
  // ============================================================================
  //                         SAVE TEACHER'S ATTENDANCE  - HIGH SCHOOL
  // ============================================================================
  saveTeacherAttendance(data: any) {

    return this.http.post(
      `${this.apiUrl}/teacher-attendance`,
      data,
      {
        responseType: 'text'
      }

    );


  }
  // ============================================================================
  //                         GET TEACHER'S SALARY DATA FOR PAYMENT  - HIGH SCHOOL
  // ============================================================================

  getTeacherSalaryData(
    month: number,
    year: number
  ) {

    return this.http.get<any[]>(
      `${this.apiUrl}/teacher-salary-data?month=${month}&year=${year}`
    );

  }

  // ============================================================================
  //                         MAKE TEACHER'S SALARY PAYMENT  - HIGH SCHOOL
  // ============================================================================

  processTeacherSalary(data: any) {

    return this.http.post(
      `${this.apiUrl}/teacher-salary`,
      data,
      {
        responseType: 'text'
      }
    );

  }



  // ============================================================================
  // ANALYTICS DASHBOARD  FOR HIGH SCHOOL AND PRIMARY 
  // ============================================================================

  getAnalyticsDashboard() {

    return this.http.get(
      this.apiUrl + '/analytics-dashboard'
    );

  }



  getStudentDetails() {

  return this.http.get<any[]>(

    this.apiUrl +
    '/student-details'

  );

}
updateStudent(
  data: any
) {

  return this.http.put(

    this.apiUrl +
    '/student',

    data,

    {
      responseType: 'text'
    }

  );

}
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ============================================================================
  //                         PRIMARY API CALLS
  // ============================================================================

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////




  // ============================================================================
  // INSERT STUDENT - PRIMARY
  // ============================================================================

  addPrimaryStudent(data: any) {

    return this.http.post(

      this.apiUrl +
      '/primary-student',

      data,

      {
        responseType: 'text'
      }

    );

  }

  getPrimaryStudents() {

    return this.http.get<any[]>(

      this.apiUrl +
      '/primary-students'

    );

  }
getPrimaryStudentsByGrade(
  gradeId: number
) {

  return this.http.get<any[]>(

    this.apiUrl +
    '/primary-students/grade/' +
    gradeId

  );

}
  addPrimaryPayment(data: any) {

    return this.http.post(

      this.apiUrl +
      '/primary-payment',

      data,

      {
        responseType: 'text'
      }

    );

  }

  getPrimaryBalance() {

    return this.http.get<any[]>(

      this.apiUrl +
      '/primary-balance'

    );

  }
getAllPrimaryPaymentHistory() {

  return this.http.get<any[]>(

    this.apiUrl +
    '/primary-payment-history/all'

  );

}
  getPrimaryPaymentHistory(
    studentId: number
  ) {

    return this.http.get<any[]>(

      this.apiUrl +
      '/primary-payment-history/' +
      studentId

    );

  }

getPrimarySubjects() {

  return this.http.get<any[]>(

    this.apiUrl +
    '/primary-subjects'

  );

}
  addPrimaryTeacher(
  data: any
) {

  return this.http.post(

    this.apiUrl +
    '/primary-teacher',

    data,

    {
      responseType: 'text'
    }

  );

}

  getPrimaryTeacherAttendanceData(
    month: number,
    year: number
  ) {

    return this.http.get<any[]>(

      this.apiUrl +
      '/primary-teacher-attendance-data' +
      '?month=' +
      month +
      '&year=' +
      year

    );

  }

  savePrimaryAttendance(
    data: any
  ) {

    return this.http.post(

      this.apiUrl +
      '/primary-teacher-attendance',

      data,
      
    {
      responseType: 'text'
    }

    );

  }


  getPrimaryTeacherSalaryData(
    month: number,
    year: number
  ) {

    return this.http.get<any[]>(

      this.apiUrl +
      '/primary-teacher-salary-data' +
      '?month=' +
      month +
      '&year=' +
      year

    );

  }

  processPrimaryTeacherSalary(
    data: any
  ) {

    return this.http.post(

      this.apiUrl +
      '/primary-teacher-salary',

      data,
      
    {
      responseType: 'text'
    }

    );

  }

  getPrimaryAnalyticsDashboard() {

    return this.http.get<any>(

      this.apiUrl +
      '/primary-analytics-dashboard'

    );

  }





getPrimaryStudentDetails() {

  return this.http.get<any[]>(

    this.apiUrl +
    '/primary-student-details'

  );

}

updatePrimaryStudent(
  data: any
) {

  return this.http.put(

    this.apiUrl +
    '/primary-student',

    data,

    {
      responseType: 'text'
    }

  );

}






/////////////////////////////////////////////////////////////////////////////////


// ============================================================================
//                         GET EXAMS
// ============================================================================

getExams() {

  return this.http.get<any[]>(

    this.apiUrl +
    '/exams'

  );

}

// ============================================================================
//                         GET ACTIVE ACADEMIC YEAR
// ============================================================================

getActiveAcademicYear() {

  return this.http.get<any>(

    this.apiUrl +
    '/activeAcademicYear'

  );

}

// ============================================================================
//                         LOAD EXISTING MARKS
// ============================================================================

loadMarks(
  examId: number,
  gradeId: number,
  academicYearId: number
) {

  return this.http.get<any[]>(

    this.apiUrl +
    '/loadMarks' +
    '?examId=' + examId +
    '&gradeId=' + gradeId +
    '&academicYearId=' + academicYearId

  );

}

// ============================================================================
//                         SAVE MARKS
// ============================================================================

saveMarks(
  data: any
) {

  return this.http.post(

    this.apiUrl +
    '/saveMarks',

    data,

    {
      responseType: 'text'
    }

  );

}

// ============================================================================
//                         FINAL SUBMIT
// ============================================================================

// ============================================================================
// FINAL SUBMIT
// ============================================================================

finalSubmit(
  data: any
) {

  return this.http.put(

    this.apiUrl +
    '/finalSubmit',

    data,

    {
      responseType: 'text'
    }

  );

}
// ============================================================================
//                         STUDENT RESULT
// ============================================================================

getStudentResult(
  studentId: number,
  examId: number
) {

  return this.http.get<any[]>(

    this.apiUrl +
    '/studentResult' +
    '?studentId=' + studentId +
    '&examId=' + examId

  );

}

// ============================================================================
//                         GRADE RESULT
// ============================================================================

getGradeResult(
  gradeId: number,
  examId: number
) {

  return this.http.get<any[]>(

    this.apiUrl +
    '/gradeResult' +
    '?gradeId=' + gradeId +
    '&examId=' + examId

  );

}

// ============================================================================
//                         REPORT CARD
// ============================================================================

downloadReportCard(
  studentId: number,
  examId: number
) {

  return this.http.get(

    this.apiUrl +
    '/reportCard' +
    '?studentId=' + studentId +
    '&examId=' + examId,

    {
      responseType: 'blob'
    }

  );

}

// ============================================================================
//                         GRADE REPORT
// ============================================================================

downloadGradeReport(
  gradeId: number,
  examId: number
) {

  return this.http.get(

    this.apiUrl +
    '/gradeReport' +
    '?gradeId=' + gradeId +
    '&examId=' + examId,

    {
      responseType: 'blob'
    }

  );

}


// ============================================================================
// GET SAVED EXAM MARKS
// ============================================================================

getExamMarks(
  examId: number,
  gradeId: number,
  academicYearId: number
) {

  return this.http.get<any>(

    this.apiUrl +
    '/examMarks' +
    '?examId=' + examId +
    '&gradeId=' + gradeId +
    '&academicYearId=' + academicYearId

  );

}

// ============================================================================
// GET CLASS MARKS
// ============================================================================

generateClassMarksPdf(
  examId: number,
  gradeId: number,
  academicYearId: number
) {

  return this.http.get<any>(

    this.apiUrl +
    '/classMarks' +
    '?examId=' + examId +
    '&gradeId=' + gradeId +
    '&academicYearId=' + academicYearId

  );

}
}




















