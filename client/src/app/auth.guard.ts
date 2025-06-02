import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    console.log('AuthGuard checked. Token:', token); // 👈

    if (token) {
      return true;
    }

    return this.router.parseUrl('/login');
  }
}
