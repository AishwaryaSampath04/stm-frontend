import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css'] 
})
export class NewpasswordComponent implements OnInit {
  loginForm: any;
  passwordForm: FormGroup;
  hide = true;
  
  
  

   constructor(  private router: Router,private fb: FormBuilder,   private authService: AuthService, private tokenStorage: TokenStorageService  ) {
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
      },
      { validators: this.passwordMatchValidator } // form-level validator
    );
  }

  ngOnInit(): void {}

  // Form-level validator to check if passwords match
  passwordMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  

onSubmit(): void {
  if (this.passwordForm.invalid) return;

  const currentUser = this.tokenStorage.getUser();
  console.log(currentUser);
  console.log(currentUser.username);
  if (!currentUser || !currentUser.username) {
    Swal.fire({ icon: 'warning', title: 'Not logged in', text: 'Please login first.' }).then(() => {
      this.router.navigate(['/login']);
    });
    return;
  }

  const newPassword = this.passwordForm.get('newPassword')?.value;

  this.authService.changePassword(currentUser.username, newPassword).subscribe({
    next: res => {
      Swal.fire({ icon: 'success', title: 'Password updated!', text: 'Please login again.' }).then(() => {
        this.tokenStorage.signOut();
        this.router.navigate(['/login']);
      });
    },
    error: err => {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update password' });
    }
  });
}





  updatePassword(password: string) {
    console.log("Password updated successfully:", password);
    // Call API/service here to update the password
  }
}
