import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Login } from '../../../Model/login.model';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../Service/user.service';
import { Role } from '../../../Model/role.model';
import Swal from 'sweetalert2';
import { distinctUntilChanged } from 'rxjs';
import { noWhitespaceValidator, passwordStrengthValidator } from '../../validation/custom-validators';

@Component({
  selector: 'app-peoplemodel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './peoplemodel.component.html',
  styleUrl: './peoplemodel.component.css',
})
export class PeoplemodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  isModalOpen = false;
  loginForm: FormGroup;
  errorMessage: string = '';
  roles!: Role[];
  isedit: boolean = false;
  isSubmitting = false; 
  usernameStatus: 'valid' | 'invalid' | 'none' = 'none';
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Initialize the form group with validations
    this.loginForm = this.fb.group({
      userID: [0],
      username: ['', [Validators.required, noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),passwordStrengthValidator()]],
      roleID: [null, Validators.required],
    });
  }
  
  ngOnInit(): void {
    debugger;
    this.fetchRoles();
    this.fetchvalue();
    this.loginForm.get('username')?.valueChanges
    .pipe(     
      distinctUntilChanged() // Only trigger when the value actually changes
    )
    .subscribe((value) => {
      this.checkUsernameExists(value);
    });
  }
  //fetch role
  fetchRoles(): void {
    const role = localStorage.getItem('Role');
    if (role) {
      this.userService.getRoles(role).subscribe((data: Role[]) => {
        this.roles = data; // Assign fetched roles to the roles array
      });
    }
  }
  //patch value loginForm
  fetchvalue() {
    debugger;
    if (this.item) {
      this.isedit = true;
      this.loginForm.patchValue({
        userID: this.item.userID,
        username: this.item.username,
        email: this.item.email,
        password: this.item.password,
        roleID: this.item.roleID,
      });
    }
  }
  //input time check exist
  checkUsernameExists(event: Event): void {
    debugger;
    const input = (event.target as HTMLInputElement)?.value;
  
    if (!input || this.loginForm.get('username')?.invalid) {
      this.usernameStatus = "none"; // Reset the status if input is empty
      return;
    }  
    const Adminid = Number(localStorage.getItem("UserId"));
    const userid = this.item?.userID || 0;
  
    this.userService.checkUsernameExists(input, Adminid, userid).subscribe((exists: boolean) => {
      this.usernameStatus = exists ? "invalid" : "valid";
    });
  }  
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible; // Toggle the visibility
  }
  //Add / Edit People
  onSubmit() {
    debugger;
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;  
      const loginData: Login = this.loginForm.value;
      loginData.username=loginData.username.trim();
      loginData.hadAdminId = Number(localStorage.getItem('UserId'));
      this.userService.registerpeople(loginData).subscribe({
        next: (response: number) => {
          if (response === 0) {
            // Show SweetAlert for failure
            Swal.fire({
              icon: 'error',
              title: 'Duplicate Username',
              text: 'A user with this username already exists in your List.',
              confirmButtonColor: '#d33',
            }).then(() => {
              this.loginForm.reset();
              this.usernameStatus='none';
            });
            
          } else {
            Swal.fire({
              icon: 'success',
              title:
                this.loginForm.value.userID > 0
                  ? 'User Updated Successfully'
                  : 'Registration Successful',
              text: `User ${
                this.loginForm.value.userID > 0
                  ? 'updated Successfully'
                  : 'Add Successfully'
              }.`,
              confirmButtonColor: '#3085d6',
            }).then(() => {
              // Close the modal after the user clicks "OK"
              this.loginForm.reset();
              this.closeModal();
              this.isSubmitting = false;
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            'An error occurred during registration. Please try again.';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  //Model Open
  openModal() {
    this.isModalOpen = true;
  }
  //Model Close
  closeModal() {
    this.close.emit(); // Emit close event
  }
}
