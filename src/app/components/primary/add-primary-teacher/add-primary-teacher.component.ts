import { Component, OnInit } from '@angular/core';
import { StmService } from '../../../services/stm.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-primary-teacher',
  templateUrl: './add-primary-teacher.component.html',
  styleUrls: ['./add-primary-teacher.component.css']
})
export class AddPrimaryTeacherComponent implements OnInit {

  subjects: any[] = [];

  teacher: any = {

    teacherName: '',

    mobileNo: '',

    subjectId: '',

    monthlySalary: '',

    joiningDate: '',

    activeFlag: 'Y'

  };

  constructor(
    private stmService: StmService
  ) { }

  ngOnInit(): void {

    this.loadSubjects();

  }

  loadSubjects(): void {

    this.stmService
      .getPrimarySubjects()
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

      width: '560px',

      showCloseButton: true,

      showCancelButton: true,

      confirmButtonText: 'Yes',

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
      .addPrimaryTeacher(this.teacher)
      .subscribe({

        next: (response: string) => {

          console.log(response);

          Swal.fire({

            icon: 'success',

            title: 'Saved Successfully',

            text: 'Primary teacher has been saved successfully.',

            width: '560px',

            showCloseButton: true,

            confirmButtonText: 'OK'

          }).then(() => {

            this.teacher = {

              teacherName: '',

              mobileNo: '',

              subjectId: '',

              monthlySalary: '',

              joiningDate: '',

              activeFlag: 'Y'

            };

          });

        },

        error: (err: any) => {

          console.error(err);

          Swal.fire({

            icon: 'error',

            title: 'Save Failed',

            text: err?.error || 'Error while saving teacher.',

            width: '560px',

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