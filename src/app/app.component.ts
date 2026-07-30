
import { TokenStorageService } from './services/token-storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from './services/user.service';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';
import { Component, HostListener } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent {
  showNavbar = true;
  title = "frontend";
  private roles!: string[];
  isLoggedIn = false;
  // showDashBoard = false;
  username?: string;
  showModal: boolean = false;
  showSuccess: boolean = false;

  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  languages: any[] = []; // ✅ List to store fetched languages
  selectedLanguageId: number | null = null; // Store selected value


   languageList:any[]=[];
  langId: number = 0;
  currentUrl:any;
  filteredMenu: any[] = [];
  selectedLanguage: string = '';
  menuArray: any;

    selectedLang: string = '';
   roleId: number = 0;
    @HostListener('window:pageshow', ['$event'])
onPageShow(event: PageTransitionEvent) {
  if (event.persisted) {
    window.location.reload();
  }
}

  constructor(private router: Router,
    private tokenStorageService: TokenStorageService,
    private userService: UserService,
        private languageService: LanguageService,
        private authService: AuthService,

    
     private translate: TranslateService, ) {
    //  translate.setDefaultLang('English');
 // translate.use('English');
  // translate.addLangs(['en', 'kn']);
  // translate.setDefaultLang('en');  


    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        const nav = event as NavigationEnd;
        const hideNavbarRoutes = ['/login', '/register','/home'];

        this.showNavbar = !hideNavbarRoutes.includes(nav.urlAfterRedirects);
      });

  }
  ngOnInit() {
  
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      // this.showDashBoard = this.roles.includes('ROLE_USER');
      this.username = user.username;
    }
 this.isLoggedIn = !!this.tokenStorageService.getToken();

  if (this.isLoggedIn) {
    const user = this.tokenStorageService.getUser();

    this.username = user.username;
    this.roleId = Number(user.roleId);

    console.log('Role ID =', this.roleId);
  }


  this.languageService.selectedLanguage$.subscribe(selectedLanguage => {
      this.langId=selectedLanguage.languageId;
      this.selectedLanguage = selectedLanguage.language;
      if(this.langId>0){
        this.filterMenuByLang(this.langId);
        
      }
    });

    // Retrieve the selected language from sessionStorage
    const selectedLang = sessionStorage.getItem('selectedLang') || 'English';
    // this.isLoggedIn;
    //     this.changeLang(selectedLang);
    //     sessionStorage.setItem('selectedLang', selectedLang);

        if(this.isLoggedIn ) {
        this.changeLang(selectedLang);    
        // Store the selected language in sessionStorage
        sessionStorage.setItem('selectedLang', selectedLang);
    }  
  }

  ////////////////////////////////Menu ///////////////////////////////////////
 openMenu: string = '';


toggleMenu(menu: string): void {

  this.openMenu =
    this.openMenu === menu
      ? ''
      : menu;

}

closeMenu(): void {

  this.openMenu = '';

}
  // Call changeLang only when the user logs in and hasChangeLangBeenCalled is false
    
  

   openChangePasswordModal() {
    this.showModal = true;
    this.errorMessage = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

filterMenuByLang(langId:number) {
      try {
       if (Array.isArray(this.menuArray) && this.menuArray.length > 0) {
      // Filter top-level menus by selected language
      this.filteredMenu = this.menuArray
        .filter((menu: any) => menu.lang_id === langId)
        .map((menu: any) => ({
          ...menu,
          // Filter submenu only if it has same lang_id
          submenu: (menu.submenu ?? []).filter((sub: any) => sub.lang_id === langId)
        }));
      console.log('Filtered Menu by Lang:', this.filteredMenu);
      }else{
       
      this.filteredMenu = [];
    }
  }  catch (error) {
        console.error('Error filtering menu:', error);
      }
  }


goToNextPage() {
  this.router.navigate(['/newpassword']);
}
  
  // Close modal
  closeModal() {
    this.showModal = false;
  }

  // Save new password
  changePassword() {
  if (this.newPassword !== this.confirmPassword) {
    this.errorMessage = 'Passwords do not match!';
    return;
  }

  this.userService.changePassword(this.newPassword).subscribe(
    (res: any) => {
      this.showModal = false;
      this.successMessage = 'Password changed successfully!';
      this.showSuccess = true;

      setTimeout(() => {
        this.logout();
      }, 1000);
    },
    (err: any) => {
      this.errorMessage = 'Failed to change password.';
    }
  );
}
/* onLanguageChange(event: any) {
  const langId = Number(event.target.value);
  this.filterMenuByLang(langId);
} */
onLanguageChange(event: any) {
  const langName = event.target.value; // 'English' or 'Kannada'
  this.selectedLang = langName;

  // Update selected language in sessionStorage
  sessionStorage.setItem('selectedLang', this.selectedLang);

  // Use ngx-translate
  this.translate.use(this.selectedLang);

  // Update langId based on selected language
  const selected = this.languages.find(lang => lang.name === langName);
  if (selected) {
    this.langId = selected.id;
    this.filterMenuByLang(this.langId);
    this.languageService.setSelectedLanguage(this.selectedLang, this.langId);
  }
}


 getLangType(){
    this.userService.getLangType().subscribe(res => {
      this.languageList=res;
      console.log(this.languageList);
   })
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

  changeLang(langName:string){
    if(langName!=null || langName!=undefined){
      console.log(langName);
      this.translate.use(langName);
      this.languageList.map((e:any)=>{
        if(e.name==langName){
          this.langId=e.id;
          this.languageService.setSelectedLanguage(langName,this.langId);
          console.log(this.langId)
          this.filterMenuByLang(this.langId);
        }
      })
      // Store the selected language in sessionStorage
      sessionStorage.setItem('selectedLang', langName);
    }
  }
  /* openChangePasswordModal() {
    this.showModal = true;
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }

  // Change password logic
  changePassword() {
    // Validate fields
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please enter both fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    // Call backend to change password
    this.userService.changePassword(this.newPassword).subscribe({
      next: () => {
        this.closeModal();
        this.showSuccessModal('Password changed successfully. Logging out...');
        setTimeout(() => this.logout(), 1500); // Optional delay to show success message
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Failed to change password.';
      }
    });
  }

  // Optional helper to show a success modal instead of alert
  showSuccessModal(message: string) {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 2000);
  }
  */


confirmLogout(): void {

  Swal.fire({

    title: 'Leaving So Soon?',
    
    icon: 'warning',
    width: '560px',
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true

  }).then((result) => {

    if (result.isConfirmed) {
      this.logout();
    }

  });

}


  logout() {
    this.tokenStorageService.signOut();
    window.location.href = "/login";

    
  }



  getLanguages() {
    this.userService.getLanguages().subscribe(
      (data) => {
        this.languages = data;
      },
      (error) => {
        console.error('Error fetching languages', error);
      }
    );
  }



  



}
