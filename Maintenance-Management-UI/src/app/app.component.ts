import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './Components/layout/layout.component';
import { LoginComponent } from './Components/login/login.component';
import { LoginService } from './Service/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LayoutComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Maintenance-Management';
  showLoginModal: boolean = false;
  // isAuthenticated: boolean = false;
  isAuthenticated: boolean = true; // Use `null` for the unknown state
  isLoading: boolean = false;

  constructor(private loginService: LoginService, private route: Router) {}
  ngOnInit(): void {
    
    this.checkLoginStatus();
  }
  checkLoginStatus(): void {
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token'); // Get the login token from the service
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      if (token && tokenExpiration) {
        const expirationTime = parseInt(tokenExpiration, 10);
        const currentTime = Date.now();
        if (currentTime > expirationTime) {
          this.isAuthenticated = false;
          alert('Session has expired. Please log in again.');
          localStorage.removeItem('token'); // Clear expired token
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('islogin');
          //this.route.navigate(['/']); // Redirect to login
          this.route.navigate(['/login']);
        } else {
          const role = localStorage.getItem('Role');
          this.isAuthenticated = true;
          if (localStorage.getItem('islogin') == 'yes') {
            localStorage.setItem('islogin', 'no');
            if (role === 'Host Admin' || role === 'Admin') {
              this.route.navigate(['/dashboard']);
            } else if (role == 'Requester') {
              this.route.navigate(['/request']);
            } else {
              this.route.navigate(['/workorder']);
            }
          } else {
            //this.route.navigate(['/']);
          }
        }
      } else {
        this.isAuthenticated = false;
        this.route.navigate(['/']);
      }
    } else {
      this.route.navigate(['/']);
    }
  }

  onLoginSuccess() {
    //  this.showLoginModal = false;
    this.route.navigate(['/']); // Redirect after successful login
  }
}
