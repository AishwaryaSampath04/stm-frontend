import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(public authService: AuthService, public router: Router) {}
  
canActivate(): boolean {

  console.log('===== AUTH GUARD =====');
  console.log('Token =', sessionStorage.getItem('auth-token'));
  console.log('isLoggedIn =', this.authService.isLoggedIn);

  if (this.authService.isLoggedIn) {
    console.log('ALLOW');
    return true;
  }

  console.log('BLOCK');

  this.router.navigate(['/login'], { replaceUrl: true });
  return false;
}
  
}
