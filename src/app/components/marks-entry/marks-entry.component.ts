import { Component, OnInit } from '@angular/core';
import { StmService } from 'src/app/services/stm.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-marks-entry',
  templateUrl: './marks-entry.component.html',
  styleUrls: ['./marks-entry.component.css']
})
export class MarksEntryComponent implements OnInit {

  // Masters
  exams: any[] = [];
  grades: any[] = [];
  subjects: any[] = [];
  students: any[] = [];
  academicYear: any;

  // Selected Values
  selectedExamId: any;
  selectedGradeId: any;

  // Loading
  loading = false;
  examEntryId: number = 0;
  isFinal: boolean = false;

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {

    this.loadExams();

    this.loadGrades();

    this.loadAcademicYear();

  }

  // ====================================================
  // Load Exams
  // ====================================================

  loadExams() {

    this.stmService.getExams().subscribe({

      next: (data: any) => {

        this.exams = data;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ====================================================
  // Load Grades
  // ====================================================

  loadGrades() {

    this.stmService.getGrades().subscribe({

      next: (data: any) => {

        this.grades = data;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ====================================================
  // Load Active Academic Year
  // ====================================================

  loadAcademicYear() {

    this.stmService.getActiveAcademicYear().subscribe({

      next: (data: any) => {

        this.academicYear = data;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // ====================================================
  // Load Students + Subjects
  // ====================================================

  loadStudents() {

    if (!this.selectedExamId) {

      alert('Please select Examination.');

      return;

    }

    if (!this.selectedGradeId) {

      alert('Please select Grade.');

      return;

    }

    this.loading = true;

    this.loadSubjects();

  }

  loadSubjects() {

    this.stmService.getSubjects().subscribe({

      next: (data: any) => {

        this.subjects = data.map((subject: any) => ({

          ...subject,

          maximumMarks: 0,

          passingMarks: 0

        }));

        this.loadStudentsByGrade();

      },

      error: (err) => {

        console.log(err);

        this.loading = false;

      }

    });

  }

  loadStudentsByGrade() {

    this.stmService.getStudentsByGrade(

      this.selectedGradeId

    ).subscribe({

      next: (data: any) => {

        this.students = data.map((student: any) => {

          const marks: any = {};

          this.subjects.forEach((subject: any) => {

            marks[subject.subject_id] = null;

          });

          return {

            ...student,

            marks

          };

        });

        this.loadExamMarks();

      },

      error: (err) => {

        console.log(err);

        this.loading = false;

      }

    });

  }

  loadExamMarks() {

    this.stmService.getExamMarks(

      this.selectedExamId,

      this.selectedGradeId,

      this.academicYear.academic_year_id

    ).subscribe({

      next: (response: any) => {

        console.log(response);

        if (response.exists) {

          this.examEntryId = response.examEntryId;

          this.isFinal = response.status === 'FINAL';

          this.loadSavedMarks(response.marks);

        }

        this.loading = false;

      },

      error: (err) => {

        console.log(err);

        this.loading = false;

      }

    });

  }


  loadSavedMarks(marks: any[]) {

    marks.forEach(mark => {

      const subject = this.subjects.find(

        s => s.subject_id == mark.subject_id

      );

      if (subject) {

        subject.maximumMarks = mark.maximum_marks;

        subject.passingMarks = mark.passing_marks;

      }

      const student = this.students.find(

        s => s.student_id == mark.student_id

      );

      if (student) {

        student.marks[mark.subject_id] = mark.marks_obtained;

      }

    });

  }
  // ====================================================
  // Save
  // ====================================================

  saveMarks() {

    const payload = {

      examId: this.selectedExamId,

      gradeId: this.selectedGradeId,

      academicYearId: this.academicYear.academic_year_id,

      subjects: this.subjects,

      students: this.students

    };

    console.log(payload);

    this.stmService.saveMarks(payload).subscribe({

      next: (response: any) => {

        alert('Marks saved successfully.');

        console.log(response);

      },

      error: (error) => {

        console.error(error);

        alert('Unable to save marks.');

      }

    });

  }
  // ====================================================
  // Final Submit
  // ====================================================
  finalSubmit() {

    if (!confirm('Are you sure you want to Final Submit?')) {

      return;

    }

    const data = {

      examId: this.selectedExamId,

      gradeId: this.selectedGradeId,

      academicYearId: this.academicYear.academic_year_id

    };

    this.stmService.finalSubmit(data).subscribe({

      next: (response: any) => {

        alert(response);

      },

      error: (error) => {

        console.error(error);

        alert(error.error);

      }

    });

  }
  // ====================================================
  // Total
  // ====================================================

  calculateTotal(student: any): number {

    let total = 0;

    if (!student.marks) {

      return total;

    }

    Object.keys(student.marks).forEach(key => {

      total += Number(student.marks[key] || 0);

    });

    return total;

  }
  // ====================================================
  // Result
  // ====================================================

  calculateResult(student: any): string {

    for (let subject of this.subjects) {

      const mark =
        Number(student.marks[subject.subject_id] || 0);

      const pass =
        Number(subject.passingMarks || 0);

      if (mark < pass) {

        return 'FAIL';

      }

    }

    return 'PASS';

  }


  generateClassMarksPdf() {

    this.stmService.generateClassMarksPdf(

      this.selectedExamId,

      this.selectedGradeId,

      this.academicYear.academic_year_id

    ).subscribe({

      next: (response: any) => {

        this.createPdf(response);

      },

      error: (err) => {

        console.log(err);

      }

    });

  }


  createPdf(data: any) {

    const doc = new jsPDF(

      'landscape'

    );

    doc.setFontSize(18);

    doc.text(

      'STUDENT MANAGEMENT SYSTEM',

      148,

      15,

      {

        align: 'center'

      }

    );

    doc.setFontSize(14);

    doc.text(

      'PROGRESS REPORT',

      148,

      24,

      {

        align: 'center'

      }

    );

    doc.setFontSize(11);

    doc.text(

      'Academic Year : ' + data.academicYear,

      14,

      35

    );

    doc.text(

      'Examination : ' + data.exam,

      120,

      35

    );

    doc.text(

      'Grade : ' + data.grade,

      220,

      35

    );

    //-------------------------------------------------------
    // Headers
    //-------------------------------------------------------

    const headers: any[] = [

      'Admission No',

      'Student Name'

    ];

    data.subjects.forEach((s: any) => {

      headers.push(

        s.subject_name

      );

    });

    headers.push(

      'Total'

    );
headers.push(

  'Parent Signature'

);
    //-------------------------------------------------------
    // Group Student Marks
    //-------------------------------------------------------

    const studentMap: any = {};

    data.marks.forEach((m: any) => {

      const key = m.admission_no;

      if (!studentMap[key]) {

        studentMap[key] = {

          admission_no: m.admission_no,

          student_name: m.student_name,

          marks: {}

        };

      }

      studentMap[key].marks[m.subject_id] = Number(m.marks_obtained);

    });
    //-------------------------------------------------------
    // Rows
    //-------------------------------------------------------

    const rows: any[] = [];

    Object.values(studentMap).forEach((student: any) => {

      const row: any[] = [

        student.admission_no,

        student.student_name

      ];

      let total = 0;

      data.subjects.forEach((subject: any) => {

        const mark =

          student.marks[subject.subject_id] || 0;

        total += mark;

        row.push(mark);

      });

      row.push(total);
      // Parent Signature (blank)
      row.push('');

      rows.push(row);

    });

    //-------------------------------------------------------
    // Table
    //-------------------------------------------------------

    autoTable(doc, {

      head: [

        headers

      ],

      body: rows,

      startY: 45,

      styles: {

        fontSize: 9,

        halign: 'center'

      },

      headStyles: {

        fillColor: [

          20,

          108,

          67

        ]

      }


    });
    //-------------------------------------------------------
    // Summary Table
    //-------------------------------------------------------

    const summaryHeaders: any[] = [''];

    let maxRow: any[] = ['Maximum Marks'];

    let passRow: any[] = ['Passing Marks'];

    let totalMaximum = 0;

    let totalPassing = 0;

    const processedSubjects = new Set<number>();

    data.subjects.forEach((subject: any) => {

      summaryHeaders.push(subject.subject_name);

      const mark = data.marks.find((m: any) => m.subject_id == subject.subject_id);

      if (mark) {

        maxRow.push(mark.maximum_marks);

        passRow.push(mark.passing_marks);

        totalMaximum += Number(mark.maximum_marks);

        totalPassing += Number(mark.passing_marks);

      }

    });

    summaryHeaders.push('Total');

    maxRow.push(totalMaximum);

    passRow.push(totalPassing);

    autoTable(doc, {

      head: [

        summaryHeaders

      ],

      body: [

        maxRow,

        passRow

      ],

      startY: (doc as any).lastAutoTable.finalY + 8,

      theme: 'grid',

      styles: {

        fontSize: 10,

        halign: 'center',

        cellPadding: 2

      },

      headStyles: {

        fillColor: [220, 220, 220],

        textColor: 0

      },

      bodyStyles: {

        textColor: 0

      }

    });
    //-------------------------------------------------------

    //-------------------------------------------------------

    //-------------------------------------------------------
    // File Name
    //-------------------------------------------------------

    const now = new Date();

    const pad = (value: number) => value.toString().padStart(2, '0');

    const timestamp =
      now.getFullYear() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      "_" +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());

    const examName = String(data.exam)
      .replace(/\s+/g, "_");

    const gradeName = String(data.grade)
      .replace(/\s+/g, "_");

    const fileName =
      examName +
      "_" +
      gradeName +
      "_Marks_Sheet_" +
      timestamp +
      ".pdf";

    doc.save(fileName);
  }
}