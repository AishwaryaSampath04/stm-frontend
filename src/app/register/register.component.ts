import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
@ViewChild('alertDialog') alertDialog!: TemplateRef<any>;
  signupForm!: FormGroup;
  email?: string;
  password?: string;
  confirmpassword?: string;
  username?: string;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';


  
  constructor(private fb: FormBuilder, private authService: AuthService,private dialog: MatDialog) {
    this.createForm();
  }
  ngOnInit() {
  }

  createForm() {
    this.signupForm = this.fb.group({
      email: ['', Validators.required ],
      username: ['', Validators.required ],
      password: ['', Validators.required ],
      confirmPassword: ['', Validators.required ],
    });
     
  }  
    showErrorModal = false;
  checkcredentiasls(): void{
    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      this.onSubmit();
     }
     else{
    this.showErrorModal = true;

     }
     

  }
   closeModal(): void {
    this.showErrorModal = false;
  }
// No error
onSubmit() {

    // Stop if form is invalid
    if (this.signupForm.invalid) {
      if (this.signupForm.errors?.['passwordMismatch']) {
        alert('Your credentials do not match.');
      } else {
        alert('Please fill all required fields correctly.');
      }
      return;
    }
    

    const credentials = this.signupForm.value;
    this.authService.register(credentials).subscribe({
      next: (data) => {
         if (data?.message && data.message.toLowerCase().includes('already')) {
          this.isSignUpFailed = true;
          this.isSuccessful = false;
          this.errorMessage = 'User is already registered. Please login.';
          alert(this.errorMessage);
          return;
        }
        console.log('Registration successful:', data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        alert('Registration successful!');
        // Optional redirect:
        // window.location.href = '/login';
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = err.error.message || 'Registration failed.';
        this.isSignUpFailed = true;
         if (
          err.error?.message &&
          err.error.message.toLowerCase().includes('already')
        ) {
          this.errorMessage = 'User is already registered. Please login.';
        } else {
          this.errorMessage =
            err.error?.message || 'Registration failed. Please try again.';
        }

         this.isSignUpFailed = true;
      alert(this.errorMessage);
      },
    });
  }
}