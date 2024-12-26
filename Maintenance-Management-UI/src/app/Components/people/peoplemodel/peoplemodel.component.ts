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

  ngOnInit(): void {
    this.fetchRoles();
    this.fetchvalue();
  }
  fetchRoles(): void {
    const role = localStorage.getItem('Role');
    if (role) {
      this.userService.getRoles(role).subscribe((data: Role[]) => {
        this.roles = data; // Assign fetched roles to the roles array
      });
    }
  }
  fetchvalue() {
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

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Initialize the form group with validations
    this.loginForm = this.fb.group({
      userID: [0],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleID: [undefined, Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: Login = this.loginForm.value;
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
            });
            this.loginForm.reset();
          } else {

            Swal.fire({
              icon: 'success',
              title: this.loginForm.value.userID > 0 ? 'User Updated Successfully' : 'Registration Successful',
              text:  `User ${
                this.loginForm.value.userID  > 0 ? 'updated Successfully' : 'Add Successfully'
              }.`,
              confirmButtonColor: '#3085d6',
            }).then(() => {
              // Close the modal after the user clicks "OK"
              this.loginForm.reset();
              this.closeModal();
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
  closeModal() {
    this.close.emit(); // Emit close event
  }

  openModal() {
    this.isModalOpen = true;
  }
}
