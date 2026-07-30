import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';   
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { LanguageService } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



export class Item {

  constructor(
    public id: number,
    public title: string,
    public description: string,
    public quantity: any,                                                                                                                             
    public tag: string,
    public dueDate: Date,
    public status: string,
    public active: boolean

  ) {
  }
}
export interface StatusResponse {
  status: string;
}

@Component({
  selector: 'app-board-admin',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {



  content = '';
  bForm!: FormGroup;
  title?: string;
  description?: string;
  quantity?: any;
  tag?: string;
  dueDate?: Date;
  
  status?: string;
  errorMessage = '';
 items: Item[] = []; // initialize as empty array

  tags = ['High', 'Medium', 'Low'];
  selectedTag?: string;
  editMode: boolean = false;
  editItemId?: number | null = null;
  searchControl: FormControl = new FormControl(''); // NEW
  filteredItems: Item[] = [];
currentItems: Item[] = [];

  totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 0; // backend pages are 0-indexed
  totalPages: number = 0;
  statuses: string[] = []; // dropdown options
  selectedStatus: string = ''; // selected value
  statusControl: FormControl = new FormControl('');
  active: boolean = false;
   statusList: string[] = [];
  todoList: any[] = [];

  pages: number[] = [];
 

selectedFile: File | null = null;
  selectedFileName = 'No file chosen';
  uploadProgress = 0;
  isUploading = false; // disables button while uploading



  constructor(private http: HttpClient,
     private router: Router,
     private dialog: MatDialog,
     private fb: FormBuilder, 
     private userService: UserService, 
     private tokenStorageService: TokenStorageService,
     private languageService: LanguageService,
    
        
         private translate: TranslateService) {
    this.createForm();  translate.setDefaultLang('Kannada');
  translate.use('Kannada');

  }

// Popup states
openFileErrorPopup = false;
fileErrorMessage = '';

openFileSuccessPopup = false;
fileSuccessMessage = '';



  createForm() {
    this.bForm = this.fb.group({
      title: ['', Validators.required],
      tag: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['', Validators.required],
      
      
      active: [false],
    });
  }
 ngOnInit() {
  this.getLangLabel();
  // 1. Load first page with no filters
  this.loadPage(this.currentPage);

  // 2. Load all items for other UI logic
  this.userService.getItems().subscribe(
    data => {
      this.items = Array.isArray(data) ? data : data?.content ?? [];

      //  this.checkPendingTaskReminders();

      // 🔁 Start auto reminders
      this.startReminderTimer();


    console.log('Items loaded for Excel:', this.items);
      // LISTEN TO SEARCH BAR
      this.searchControl.valueChanges.subscribe((key: string) => {
        this.currentPage = 0;
        this.loadPage(this.currentPage, key, this.statusControl.value);
      });
      (  err: any) => console.error('Error loading items', err)
       // 4. Listen to status dropdown changes
 /*  this.statusControl.valueChanges.subscribe((status: string) => {
    this.currentPage = 0;
    this.loadPage(this.currentPage, this.searchControl.value, status);
  });  */
    }
  );

  // 3. Load statuses from backend
 this.userService.getStatuse().subscribe(resp => {
  this.statusList = resp.map(r => r.status);
  console.log("Status list → ", this.statusList);
});



  // 4. LISTEN TO STATUS DROPDOWN
  this.statusControl.valueChanges.subscribe((status: string) => {
    this.currentPage = 0;
    this.loadPage(this.currentPage, this.searchControl.value, status);
  });
}


  displayedColumns: string[] = ['id', 'title', 'description', 'quantity', 'tag', 'dueDate', 'status', 'active', 'actions'];



 /*  loadPage(page: number, key?: string, status?: string) {
  this.userService.getTodosByPage(page, this.pageSize, key, status).subscribe(
    data => {
       
      this.currentItems = data.content.filter((item: any) => item.delete === false);
      this.totalPages = data.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      this.totalItems = data.totalElements;
    },
    err => console.error(err)
  );
} */


  loadPage(page: number, key?: string, status?: string) {
  this.userService.getTodosByPage(page, this.pageSize, key, status).subscribe(
    data => {
      // Filter deleted items first
     

    this.currentItems = data.content
      this.totalPages = data.totalPages;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
      this.totalItems = data.totalElements;
    },
    err => console.error(err)
  );
}


 pageEvent(event: PageEvent): void {
    // update page size and page index
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // reload data for this page — call your existing loadPage
    this.loadPage(this.currentPage, this.searchControl.value, this.statusControl.value);
  }


  goToPage(page: number) {
    this.currentPage = page;
    this.loadPage(this.currentPage, this.searchControl.value);
  }

  filterItems(text?: string) {
    const search = (text ?? '').toLowerCase().trim();

    this.filteredItems = this.items.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.id.toString().includes(search)
        );
  }


  trackById(index: number, item: Item): number {
    return item.id;
  }
 openFormPopup = false;
  openErrorPopup = false;


  openPopup() {
    this.bForm.reset();
    this.editItemId = null;
    this.openFormPopup = true;
  }

  closeFormPopup() {
    this.openFormPopup = false;
  }
  closeErrorPopup() {
  this.openErrorPopup = false;
}



openSuccessPopup = false;
  resetForm(): void {
  // Reset the form fields
  this.bForm.reset();


 

  // Clear editItemId if it was an edit
  this.editItemId = null;

  // Close any error popup
  this.openErrorPopup = false;

  // If you have a modal, make sure it is closed
  this.closeFormPopup();
}


save(): void {
  if (this.bForm.valid) {
    const formValue = this.bForm.value;

    // If user selected tag manually
    formValue.tag = this.selectedTag ?? formValue.tag;

    // Check if editing existing item
    if (this.editItemId !== undefined && this.editItemId !== null) {
      this.updateItem(this.editItemId, formValue);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Item has been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this.onSubmit(formValue); // add new item
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: 'New item has been added successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    }
    this.closeFormPopup();  
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Form Invalid',
      text: 'Please fill all required fields correctly.',
      confirmButtonColor: '#d33'
    });
    this.openErrorPopup = true;
  }
}











  onSubmit(data: any) {
    const arg = {
      title: data.title,
      description: data.description,
      quantity: Number(data.quantity),
      tag: data.tag,
      dueDate: new Date(data.dueDate).toISOString(),
      status: data.status,
    };

    this.userService.postItems(arg).subscribe(
      response => {
        this.items.push(response);
        this.filterItems(this.searchControl.value);
        this.bForm.reset();
        this.selectedTag = undefined;
         this.closeFormPopup();
          this.openSuccessPopup = true;
      },
      err => {
        this.errorMessage = err.error.message || 'Add failed';
      }
    );
  }

  openDeleteConfirm = false;
openDeleteSuccess = false;
deleteItemId: number | null = null;

openDeletePopup(id: number) {
  this.deleteItemId = id;  // store ID
  this.openDeleteConfirm = true;
  
}


openInactivePopup = false;


  /*  deleteItem(id: number | null): void {
  if (id === null) return;

  const item = this.currentItems.find(i => i.id === id);
  if (!item) return;

  // Check if item is active or inactive
  if (item.active) {
    // Active → cannot delete
    this.openDeleteConfirm = false;   // close confirmation popup
    this.openInactivePopup = true;    // show inactive popup
    return;
  }

  // Inactive → delete  
  this.userService.deleteItem(id).subscribe(
    () => {
      this.openDeleteConfirm = false; 
      this.openDeleteSuccess = true; 
      this.loadPage(this.currentPage, this.searchControl.value);
    },
    err => {
      this.errorMessage = err.error?.message || 'Delete failed';
      this.openDeleteConfirm = false;
    }
  );
}  */
deleteItem(id: number | null): void {
  if (id === null) return;

  this.userService.deleteItem(id).subscribe(
    () => {
      // remove from UI immediately without reloading
      this.currentItems = this.currentItems.filter(item => item.id !== id);
      this.totalItems -= 1;

      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i);

      this.openDeleteConfirm = false;
      this.openDeleteSuccess = true;
    },
    err => {
      this.errorMessage = err.error?.message || 'Delete failed';
      this.openDeleteConfirm = false;
    }
  );
}

areYouSure(item: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to ${item.active ? 'change' : 'activate'} this item?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then(result => {
    if (result.isConfirmed) {
      this.toggleActive(item); // call toggleActive only if YES is clicked
    }
  });
}



// todo.component.ts
toggleActive(item: any) {
  item.active = !item.active; // user clicked checkbox
  this.userService.activeStatus(item).subscribe({
    next: () => console.log(`Todo ${item.id} updated to ${item.active}`),
    error: err => console.error('Error updating todo', err)
  });
}

  // New method for updating item
  updateItem(id: number, data: any) {
    const arg = {
      title: data.title,
      description: data.description,
      quantity: Number(data.quantity),
      tag: data.tag,
      dueDate: new Date(data.dueDate).toISOString(),
      status: data.status,
    };

    this.userService.updateItem(id, arg).subscribe(
      (response: Item) => {  //
        // Update the local items array
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
          this.items[index] = response;
          this.filterItems(this.searchControl.value);
         this.loadPage(this.currentPage, this.searchControl.value, this.statusControl.value);

          /* this.statusControl.valueChanges.subscribe((value) => {
  this.loadPage(value || '');
}); */

        }

        // Reset form and edit state
        this.bForm.reset();
        this.selectedTag = undefined;
        this.editItemId = null;
      },
      (err: any) => {  // 
        this.errorMessage = err.error.message;
      }
    );
  }

  // Edit item function now stores the item ID
  editItem(item: Item) {
    this.bForm.patchValue({
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      tag: item.tag,
      dueDate: item.dueDate,
      status: item.status
    });

    this.selectedTag = item.tag;
    this.editItemId = item.id;
    this.openFormPopup = true; // store id for updating
  }

  public selectCategory(event: Event): any {
    this.selectedTag = (event.target as HTMLInputElement).value;
  }




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

    this.http.post('https://spuracademy.onrender.com/api/todos/upload', formData, {
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
         this.router.navigate(['/bForm']); 
      },
      error => {
        console.error('Upload failed:', error);
        alert('File size exceeds the 2 MB limit!' );
        this.isUploading = false;
      }
    );
  }
  
 
  searchItems(key: string) {
  const search = key?.trim().toLowerCase() || '';

 if (!search) {
  this.filteredItems = this.items; // show all
  return;
}


  this.userService.searchItems(search).subscribe(
    data => {
      // Filter only active items from the results
     this.filteredItems = data; 
      console.log("Search results:", this.filteredItems);
    },
    err => console.error(err)
  );
}

  goToNextPage() {
  this.router.navigate(['/task']);
}
  


getLangLabel(){
    try {
      this.userService.getLangLabel().subscribe(res => {
        console.log(res);
      })
    }catch (error) {
      console.error('Error language:', error);
    }
  }


downloadExcel() {
  const itemsToExport = Array.isArray(this.items) ? this.items : [];

  if (itemsToExport.length === 0) {
    console.warn('No items to export!');
    return;
  }

  // Convert date safely
  const formatDate = (value: Date | string | null): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};


  const dataToExport = itemsToExport.map((item, i) => ({
    'Sl No': i + 1,
    'ID': item.id,
    'Title': item.title,
    'Description': item.description,
    'Quantity': item.quantity,
    'Tag': item.tag,
    'Due Date': formatDate(item.dueDate),   // ✅ REAL DATE
    'Status': item.status,
    'Active': item.active ? 'Yes' : 'No'
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

  /* 🔹 Force Due Date column as Excel Date */
  const dueDateColIndex = Object.keys(dataToExport[0]).indexOf('Due Date');

  for (let r = 1; r <= dataToExport.length; r++) {
    const cellRef = XLSX.utils.encode_cell({ r, c: dueDateColIndex });
    const cell = worksheet[cellRef];

    if (cell && cell.v instanceof Date) {
      cell.t = 'd';                 // Date type
      cell.z = 'dd-mm-yyyy';        // Excel display format
    }
  }

  /* 🔹 Column widths */
  worksheet['!cols'] = Object.keys(dataToExport[0]).map(key => ({
    wch: Math.max(key.length + 2, 18)
  }));

  /* 🔹 Bold header */
  Object.keys(dataToExport[0]).forEach((_, colIndex) => {
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (worksheet[headerCell]) {
      worksheet[headerCell].s = { font: { bold: true } };
    }
  });

  const workbook: XLSX.WorkBook = {
    Sheets: { 'Todos': worksheet },
    SheetNames: ['Todos']
  };

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });






  

  // 📅 Timestamp filename
  const now = new Date();
  const timestamp =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_` +
    `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}.${String(now.getSeconds()).padStart(2, '0')}`;

  saveAs(blob, `Todo_List_${timestamp}.xlsx`);
}

isTaskOverdue(item: Item): boolean {
  if (!item.dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(item.dueDate);
  due.setHours(0, 0, 0, 0);

  return due <= today && item.status !== 'COMPLETED';
}


// checkPendingTaskReminders() {
//   const pendingTasks = this.items.filter(item =>
//     this.isTaskOverdue(item)
//   );

//   if (pendingTasks.length > 0) {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Pending Tasks Reminder ⏰',
//       html: `
//         <b>${pendingTasks.length}</b> task(s) are not completed.<br/>
//         Please check your dashboard.
//       `,
//       confirmButtonText: 'View Tasks'
//     });
//   }
// }
startReminderTimer() {
  setInterval(() => {
    // this.checkPendingTaskReminders();
  }, 0.5 * 60 * 1000); // every 5 minutes
}

}




