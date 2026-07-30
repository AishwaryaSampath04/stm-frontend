import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpEvent} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';



import { Observable } from 'rxjs';
const API_URL = 'http://localhost:8080/api';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private uploadUrl = 'http://localhost:8080/api/todos/upload';

  constructor(private http: HttpClient) { }
  getItems(): Observable<any> {
    return this.http.get(API_URL + '/todos', httpOptions);
  }

  searchItems(key: string): Observable<any> {
  return this.http.get(API_URL + '/todos/search', {
    params: { key }   // correctly sends ?key=abc
  });
}

  postItems(data: { title: any; description: any; quantity:any; tag: any; dueDate: any; status:any }): Observable<any> {
    return this.http.post(API_URL + '/todos',  { 
      title: data.title,
      description: data.description,
     quantity: Number(data.quantity),       
      tag: data.tag,
      dueDate: new Date(data.dueDate).toISOString(), 
      status: data.status,
    }, httpOptions);
  }

  save(data: any): Observable<any> {
  return this.http.post(API_URL + '/todos', data, httpOptions);
}

deleteItem(id: number): Observable<any> {
  return this.http.delete(API_URL + '/todos/' + id);
}



// todo.service.ts
// todo.service.ts
activeStatus(item: any): Observable<any> {
  return this.http.post(API_URL + '/todos/setStatus/'+item.id,{
    active:item.active
  }, httpOptions);
}

  updateItem(id: number, data: any): Observable<any> {
  return this.http.put<any>(`${API_URL}/todos/${id}`, data,httpOptions);
}



/* onSubmit(id: number, data: any): Observable<any> {
  return this.http.put<any>(`${API_URL}/todos/${id}`, data,httpOptions);
} */
  getAllUsers(): Observable<any> {
    return this.http.get(API_URL + '/user', { responseType: 'text' });
  }

  getUser(): Observable<any> {
    return this.http.get(API_URL + '/user/id', { responseType: 'text' });
  } 
  // user.service.ts
getTodosByPage(page: number, size: number, key?: string, status?: string): Observable<any> {
    let params: any = { page, size ,};

    if (key && key.trim() !== '') {
      params.key = key;
    }

    if (status && status.trim() !== '') {
      params.status = status;
    }

    return this.http.get<any>(API_URL + '/todos/page', { params });
  }
getCompletedTodos(page: number, size: number, searchKey?: string) {
  let params: any = { page, size };
  if (searchKey) params.key = searchKey;
  return this.http.get<any>(API_URL + '/todos/completed', { params });
}
getStatuse(): Observable<any[]> {
  return this.http.get<any[]>(API_URL + 'todos"/getStatuse');
}

 getTodosByStatus(status: string): Observable<any[]> { 
   /*  return this.http.get<any[]>(API_URL +'/getTodosByStatus?status=${status}'); */
   return this.http.get<any[]>(`${API_URL}/getTodosByStatus?status=${status}`);

  }

getLanguages(): Observable<any[]> {
  return this.http.get<any[]>(API_URL + '/todos/languages',);
}

	getLangLabel(): Observable<any> {
    return this.http.get<any[]>(API_URL+'/todos/writeJsonFile');
  }

    getLangType(): Observable<any> {
    return this.http.get(API_URL+"/todos/getLangType");
  }


 uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.http.post<HttpEvent<any>>(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

 changePassword(newPassword: string): Observable<any> {
  return this.http.put<any>(API_URL + '/change-password', {
    password: newPassword
  });
}


}

  





