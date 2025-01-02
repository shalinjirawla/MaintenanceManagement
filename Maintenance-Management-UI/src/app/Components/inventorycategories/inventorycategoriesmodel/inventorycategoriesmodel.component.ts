import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { InventoryService } from '../../../Service/inventory.service';
import {
  cleanWhitespace,
  noWhitespaceValidator,
} from '../../validation/custom-validators';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-inventorycategoriesmodel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventorycategoriesmodel.component.html',
  styleUrl: './inventorycategoriesmodel.component.css',
})
export class InventorycategoriesmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  categoryForm!: FormGroup;
  categoryStatus: 'valid' | 'invalid' | 'none' = 'none';
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {
    this.categoryForm = fb.group({
      id: [0],
      categoryName: ['', [Validators.required, noWhitespaceValidator]],
      description: ['', [Validators.required, noWhitespaceValidator]],
      hadAdminId: [],
      isActive: [],
    });
  }
  ngOnInit(): void {
    if (this.item) {
      this.categoryForm.patchValue(this.item);
    }
    this.categoryForm
      .get('categoryName')
      ?.valueChanges.pipe(
        distinctUntilChanged() // Only trigger when the value actually changes
      )
      .subscribe((value) => {
        this.checkCategoryExists(value);
      });
  }
  //input time check exist
  checkCategoryExists(event: Event): void {
    debugger;
    const input = (event.target as HTMLInputElement)?.value;

    if (!input || this.categoryForm.get('categoryName')?.invalid) {
      this.categoryStatus = 'none'; // Reset the status if input is empty
      return;
    }
    const Adminid = Number(localStorage.getItem('UserId'));
    // const poid = this.item?.userID || 0;
    const id = this.item?.id || 0;

    this.inventoryService
      .checkCategoryExists(input, Adminid, id)
      .subscribe((exists: boolean) => {
        this.categoryStatus = exists ? 'invalid' : 'valid';
      });
  }
  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      for (const key in formData) {
        if (formData[key] && typeof formData[key] === 'string') {
          formData[key] = cleanWhitespace(formData[key]); // Clean each string value
        }
      }
      formData.hadAdminId = Number(localStorage.getItem('UserId'));
      formData.isActive = true;
      this.inventoryService
        .addinventorycategoty(formData)
        .subscribe((response) => {
          Swal.fire({
            icon: 'success',
            title: `${
              formData.id == 0 ? 'Add Success' : 'Update Inventory Category'
            } `,
            text: `${
              formData.id == 0
                ? 'Add Inventory Category Successfully'
                : 'Inventory Category Update Successfully'
            } `,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closeModal();
          });
        });
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
  closeModal() {
    this.close.emit(); // Emit close event
  }
}
