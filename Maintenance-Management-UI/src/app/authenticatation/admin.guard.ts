// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router:Router) { }

  canActivate(): boolean {
    
    const role=localStorage.getItem("Role");
    if(role=='Admin' || role=='Host Admin'){
        return true;
    }else{
        return false;
    }      
  }
}
