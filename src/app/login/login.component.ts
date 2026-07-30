import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
   hide = true;
   captchaText = '';
captchaArray: string[] = [];
randomTransforms: string[] = [];
randomColors: string[] = [];
captcha: any;
  
isLoading = false;
loadingMessage = 'Please wait, logging in...';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
         private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();

  history.pushState(null, '', location.href);

  window.onpopstate = () => {
    history.pushState(null, '', location.href);
  };

    // Check if already logged in
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      const user = this.tokenStorage.getUser();
      this.roles = user?.roles || [];
    }
     this.generateCaptcha();

  this.loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    captcha: ['', Validators.required]
  });
  }

  // ---- Initialize Login Form ----
  initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  generateCaptcha() {
  const chars = "123456789";
  this.captchaText = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");

  this.captchaArray = this.captchaText.split("");

  // random rotation + scaling (captcha distortion)
  this.randomTransforms = this.captchaArray.map(() => {
    const angle = Math.floor(Math.random() * 60) - 30; // -30 to +30 degrees
    const scale = 0.8 + Math.random() * 0.5; // 0.8–1.3
    return `rotate(${angle}deg) scale(${scale})`;
  });

  // random colors for each letter
  this.randomColors = this.captchaArray.map(() => {
    const colors = ["#0d47a1", "#880e4f", "#1b5e20", "#e65100", "#4a148c"];
    return colors[Math.floor(Math.random() * colors.length)];
  });
}

  // ---- Submit Login ----
  /* onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        // Redirect after login
        window.location.href = '/dashboard';
      },
      err => {
        this.errorMessage = err?.error?.message || 'Login failed';
        this.isLoginFailed = true;
        Swal.fire({
        icon: 'error',
        title: 'Login Failed, Try again',
        text: this.errorMessage,
        confirmButtonColor: '#d33',
      });
      }
    );
  } */

/*    onSubmit(): void {
  if (this.loginForm.invalid) return;

  const credentials = this.loginForm.value;

  this.authService.login(credentials).subscribe(
    data => {
      console.log('Login response:', data); // debug

      // Save token & user
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser({ id: data.id, username: data.username, roleId: data.roleId});

      // Redirect
      window.location.href = '/stm';
    },
    err => {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Login Failed', text: err?.error?.message || 'Login failed' });
    }
  );
      if (this.loginForm.invalid) return;

  if (this.loginForm.value.captcha !== this.captchaText) {
    this.loginForm.get("captcha")?.setErrors({ captchaMismatch: true });
    this.generateCaptcha();
    return;
  }

  console.log("Login successful")
}
 */

onSubmit(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  // Validate captcha first
  if (this.loginForm.value.captcha !== this.captchaText) {
    this.loginForm.get('captcha')?.setErrors({ captchaMismatch: true });

    Swal.fire({
      icon: 'error',
      title: 'Invalid Captcha',
      text: 'Please enter the correct captcha.'
    });

    this.generateCaptcha();
    this.loginForm.patchValue({ captcha: '' });

    return;
  }

  const credentials = {
    username: this.loginForm.value.username,
    password: this.loginForm.value.password
  };

  this.authService.login(credentials).subscribe(
    data => {

      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser({
        id: data.id,
        username: data.username,
        roleId: data.roleId
      });

      // Show loading popup
      Swal.fire({
        title: 'Logging In',
        text: 'Please wait while we load your dashboard...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Redirect
      setTimeout(() => {
        window.location.href = '/stm';
      }, 500);

    },
    err => {

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err?.error?.message || 'Login failed'
      });

      this.generateCaptcha();
      this.loginForm.patchValue({ captcha: '' });
    }
  );
}
}
