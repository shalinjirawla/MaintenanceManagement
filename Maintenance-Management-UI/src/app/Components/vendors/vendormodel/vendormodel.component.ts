import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VendorService } from '../../../Service/vendor.service';
import Swal from 'sweetalert2';
import { cleanWhitespace, noWhitespaceValidator,contactNumberValidator } from '../../validation/custom-validators';

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
  isSubmitting = false;

  constructor(private fb: FormBuilder, private vendorService: VendorService) {
    this.vendoreForm = fb.group({
      id: [0],
      name: ['', [Validators.required, noWhitespaceValidator]],
      address: ['', [Validators.required,noWhitespaceValidator]],
      contactNumber: ['', [Validators.required, contactNumberValidator]],
      email: ['', [Validators.required, Validators.email]],
      contactPerson: ['', [Validators.required,noWhitespaceValidator]],
      hadAdminId: [],
      isActive: [],
      companyName: ['', [Validators.required, noWhitespaceValidator]],
    });
  }
  ngOnInit(): void {
    
    if (this.item) {
      this.vendoreForm.patchValue(this.item);
    }
  }
  
  closeModal() {
    this.close.emit();
  }
  onSubmit() {    
    debugger;
    if (this.vendoreForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formdata = this.vendoreForm.value;
      for (const key in formdata) {
        if (formdata[key] && typeof formdata[key] === 'string') {
          formdata[key] = cleanWhitespace(formdata[key]); // Clean each string value
        }
      }
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
            this.isSubmitting = false;
          });
        },
      });
    }
    else{
      this.vendoreForm.markAllAsTouched();    
    }
  }
}
