import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../Service/login.service';
import { Login } from '../../Model/login.model';
import { HttpErrorResponse } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library
import { UserService } from '../../Service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  isSignUpMode = false;
  // @Output() loginSuccess = new EventEmitter<void>(); // Event to notify parent component on login success
  showModal: boolean = false; // Controls the modal's visibility
  login: Login = new Login();
  errorMessage: string = ''; // Error message for display
  imageslogin!: string;
  admins!: Login[];
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      adminname: [],
    });
  }

  ngOnInit(): void {
    this.loginService.GetAllAdmin().subscribe((response) => {
      this.admins = response;
    });
  }
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
  onSubmit() {
   
    this.showLoader();
    if (this.isSignUpMode) {
      // Sign-Up (Registration) logic
      if (
        this.login.username !== '' &&
        this.login.password !== '' &&
        this.login.email !== '' &&
        this.login.roleID !== undefined
      ) {
        // Call the registration service
        this.userService.registerpeople(this.login).subscribe({
          next: () => {
            this.errorMessage = 'Registration successful. You can now log in.';
            this.switchToLogin(); // Switch to login mode after registration
          },
          error: (error: HttpErrorResponse) => {
            this.errorMessage =
              'An error occurred during registration. Please try again.';
          },
        });
      } else {
        this.errorMessage = 'Please fill in all fields for registration.';
      }
    } else {
    
      if (this.loginForm.valid) {
        const FormData = this.loginForm.value;
        this.loginService.authenticaluser(FormData).subscribe({
          next: (response) => {
            // Assuming the token is returned on successful login
            localStorage.setItem('token', response.token); // Store token in local storage
            const decodedToken: any = jwtDecode(response.token);
            localStorage.setItem('Role', decodedToken['Role']);
            localStorage.setItem('Rights', decodedToken['Rights']);
            localStorage.setItem('UserId', decodedToken['sub']);
            localStorage.setItem('Username', decodedToken['username']);
            localStorage.setItem('UserEmail', decodedToken['email']);
            localStorage.setItem('HadAdminId', decodedToken['family_name']);

            const tokenExpiration = decodedToken['exp'];
            if (tokenExpiration) {
              const expirationDate = new Date(tokenExpiration * 1000); // Convert to Date object

              localStorage.setItem(
                'tokenExpiration',
                expirationDate.getTime().toString()
              ); // Store as milliseconds
            }
            this.showModal = false;
            //     this.loginSuccess.emit(); // Notify parent component of login success
            //  this.closeModal(); // Close the modal on success
            localStorage.setItem('islogin', 'yes');
            window.location.reload();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.errorMessage =
                //   'Invalid username or password. Please try again.'; // Handle unauthorized error
                'User not found. Please try again.'; // Handle unauthorized error
            } else {
              this.errorMessage =
                'An unexpected error occurred. Please try again later.'; // Handle other errors
            }
          },
        });
      } else {
        this.errorMessage = 'Required fields cannot be left blank';
      }
    }
  }

  // openModal() {
  //   this.showModal = true;
  // }

  // closeModal() {
  //   this.showModal = false;
  //   this.errorMessage = ''; // Clear any error message when modal is closed
  // }
  switchToSignUp() {
    this.isSignUpMode = true; // switch to sign-up mode
  }

  switchToLogin() {
    this.isSignUpMode = false; // switch back to login mode
  }
}
