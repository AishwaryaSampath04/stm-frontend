import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  selectedFile: File | null = null;
  selectedFileName = 'No file chosen';
  uploadProgress = 0;
  isUploading = false; // disables button while uploading

  constructor(private router: Router,private http: HttpClient,private tokenStorageService: TokenStorageService) {}

  // Popup states
openFileErrorPopup = false;
fileErrorMessage = '';

openFileSuccessPopup = false;
fileSuccessMessage = '';


 onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const fileName = file.name.toLowerCase();

    // ✅ Allowed extensions
    const allowedExtensions = ['jpg', 'jpeg', 'pdf', 'doc','txt','png', 'docx'];
    const fileExt = fileName.split('.').pop();

    if (!fileExt || !allowedExtensions.includes(fileExt)) {
        this.fileErrorMessage = 'Only JPG, PDF, DOC, TXT, PNG and DOCX files are allowed!';
      this.openFileErrorPopup = true;
      this.selectedFile = null;
      this.selectedFileName = 'No file chosen';
      input.value = ''; // reset the input
      return;
    }

    // ✅ Size limit (2 MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.fileErrorMessage = 'File size exceeds the 2 MB limit!';
      this.openFileErrorPopup = true;
      this.selectedFile = null;
      this.selectedFileName = 'No file chosen';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  } else {
    this.selectedFile = null;
    this.selectedFileName = 'No file chosen';
  }
}

  onUpload() {
    if (!this.selectedFile) {
      this.fileErrorMessage = 'Please select a file first.';
    this.openFileErrorPopup = true;
      return;
    }

    if (this.isUploading) return; // prevent multiple uploads

     

    this.isUploading = true;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('token'); // your JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:8080/api/todos/upload', formData, {
      headers: headers,
      reportProgress: true,
      observe: 'events',  
      responseType: 'text'
    }).subscribe(
      event => {
       
         if (event.type === HttpEventType.Response) {
           this.fileSuccessMessage = 'File uploaded successfully!';
        this.openFileSuccessPopup = true;
          // reset state
          this.uploadProgress = 0;
          this.selectedFile = null;
          this.selectedFileName = 'No file chosen';
          this.isUploading = false;
        }
      },
      error => {
        console.error('Upload failed:', error);
        alert('File size exceeds the 2 MB limit!' );
        this.isUploading = false;
      }
    );
  }
goToPreviousPage() {
  this.router.navigate(['/stm-home']);
}





   logout() {
    this.tokenStorageService.signOut();
    window.location.href = "/login";
  }

}
