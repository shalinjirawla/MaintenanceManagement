import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VendorService } from '../../../Service/vendor.service';
import { response } from 'express';
import { UserService } from '../../../Service/user.service';
import Swal from 'sweetalert2';
import { Vendor } from '../../../Model/vendor.model';

@Component({
  selector: 'app-vendormodel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendormodel.component.html',
  styleUrl: './vendormodel.component.css',
})
export class VendormodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  isModalOpen = true;
  vendoreForm: FormGroup;  

  constructor(private fb: FormBuilder, private vendorService: VendorService) {
    this.vendoreForm = fb.group({
      id: [0],
      name: ['', Validators.required],
      address: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      contactPerson: ['', Validators.required],
      hadAdminId: [],
      isActive: [],
      companyName: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    
    if (this.item) {
      this.vendoreForm.patchValue(this.item);
    }
  }
  onContactNumberInput(event: any) {
    // Remove non-numeric characters
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  
  closeModal() {
    this.close.emit();
  }
  onSubmit() {
    
    if (this.vendoreForm.valid) {
      const formdata = this.vendoreForm.value;
      formdata.hadAdminId = Number(localStorage.getItem('UserId'));
      formdata.isActive = true;

      this.vendorService.registerVendor(formdata).subscribe({
        next: (response: number) => {
          // Show SweetAlert for failure
          Swal.fire({
            icon: 'success',
            title: `${
              formdata.id == 0 ? 'Register Success' : 'Update vendor'
            } `,
            text: `${
              formdata.id == 0
                ? 'Vendor Register Successfully'
                : 'Vendor Update Successfully'
            } `,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"

            this.closeModal();
          });
        },
      });
    }
    else{
      this.vendoreForm.markAllAsTouched();    
    }
  }
}
