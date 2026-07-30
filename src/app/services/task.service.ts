import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadedFile {
  id?: number;
  fileName: string;
  filePath: string;
}

const API_URL = 'http://localhost:8080/api/files';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  // Upload a single file
  uploadFile(file: File): Observable<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadedFile>(`${API_URL}/upload`, formData);
  }

  // Get all files
  getAllFiles(): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(API_URL);
  }

  // View / Download file
  viewFile(id: number): Observable<Blob> {
    return this.http.get(`${API_URL}/view/${id}`, { responseType: 'blob' });
  }

  // Delete file
  deleteFile(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
