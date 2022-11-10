import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  jwtHelper = new JwtHelperService();
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const token = localStorage.getItem('jwt') || '{}'; 

    if ((localStorage.getItem('jwt') !== null) && 
    (!this.jwtHelper.isTokenExpired(token))) {
      return true;
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }
}

