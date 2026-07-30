import { Component } from '@angular/core';
import { StmService } from '../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {
subjects: any[] = [];
  teacher: any = {
    teacherName: '',
    mobileNo: '',
    subjectName: '',
    monthlySalary: '',
      joiningDate: '',
  };

  constructor(private stmService: StmService) { }

  
  ngOnInit(): void {

  this.loadSubjects();

  }


  loadSubjects(): void {

  this.stmService
    .getSubjects()
    .subscribe({

      next: (data: any[]) => {
        this.subjects = data;
      },

      error: (err: any) => {
        console.error(err);
      }

    });

}
confirmAndSaveTeacher(): void {

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to save this teacher?',
    icon: 'warning',
    width: '650px',
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes, Save',
    cancelButtonText: 'No',
    reverseButtons: true
  }).then((result) => {

    if (result.isConfirmed) {

      this.saveTeacher();

    }

  });

}
saveTeacher(): void {

  this.stmService
    .addTeacher(this.teacher)
    .subscribe({

      next: (response: string) => {

        console.log('Teacher saved successfully:', response);

        Swal.fire({
          icon: 'success',
          title: 'Saved Successfully',
          text: 'Teacher has been saved successfully.',
          width: '650px',
          showCloseButton: true,
          confirmButtonText: 'OK'
        });

        this.teacher = {
          teacherName: '',
          mobileNo: '',
          subjectId: '',
          joiningDate: '',
          monthlySalary: ''
        };

      },

      error: (err: any) => {

        console.error('Error while saving teacher:', err);

        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: 'Teacher could not be saved.',
          width: '650px',
          showCloseButton: true,
          confirmButtonText: 'OK'
        });

      }

    });

}


onMobileInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, '');
}

onNameInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
}
}
