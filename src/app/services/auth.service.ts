import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }
  login(credentials: { username:any; password: any;}): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password,
    }, httpOptions);
  }
  register(user: { username: any; email: any; password: any; confirmpassword:string;}): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password,
      confirmpassword: user.confirmpassword,
    }, httpOptions);
  }
  get isLoggedIn(): boolean {
    if (this.tokenStorage.getToken()) {
      return true;
    }
    return false;
  }

/* updatePassword(data: any) {
  return this.http.put(`http://localhost:8080/api/auth/${data.id}`, data);
} */

/* updatePassword(data: { id: number, password: string }) {
  return this.http.put(AUTH_API + data.id, data);
} */

/* updatePassword(data: { id: number, password: string }): Observable<any> {
  return this.http.put(`http://localhost:8080/api/auth/${data.id}`, data);
}
 */

  changePassword(username: string, password: string): Observable<any> {
    return this.http.put(AUTH_API + 'changepassword', { username, password }, httpOptions);
  }
getRoles(): Observable<any> {
  return this.http.get(AUTH_API + 'roles');
}

}
