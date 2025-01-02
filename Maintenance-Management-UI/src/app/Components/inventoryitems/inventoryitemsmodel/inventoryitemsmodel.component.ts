import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InventoryService } from '../../../Service/inventory.service';
import { Inventorycategories } from '../../../Model/InventoryCategory.model';
import Swal from 'sweetalert2';
import {
  cleanWhitespace,
  noWhitespaceValidator,
} from '../../validation/custom-validators';

@Component({
  selector: 'app-inventoryitemsmodel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventoryitemsmodel.component.html',
  styleUrl: './inventoryitemsmodel.component.css',
})
export class InventoryitemsmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<any[]>();
  itemForm!: FormGroup;
  categories!: Inventorycategories[];
  savedItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {
    this.itemForm = fb.group({
      id: [0],
      name: ['', [Validators.required, noWhitespaceValidator]],
      inventoryCategoryId: ['', Validators.required],
      sku: ['', [Validators.required, noWhitespaceValidator]],
      unit: ['', Validators.required],
      description: [],
      availableQuantity: [null],
      allocatedQuantity: [null],
      onHandQuantity: [null],
      incomingQuantity: [null],
      minimumQuantity: [null],
      reorderLevel: [null],
      price: [null],
      location: [''],
      vendorId: [null],
      dateCreated: [new Date()],
      status: [''],
      isActive: [true],
      hadAdminId: [],
      hadAdmin: [],
      //inventoryCategory: [],
    });
  }
  ngOnInit(): void {
    const UserId = Number(localStorage.getItem('UserId'));
    this.inventoryService.getinventorycategoty(UserId).subscribe((response) => {
      this.categories = response;
    });
    if (this.item) {
      this.itemForm.patchValue(this.item);
    }
  }

  //Add Item
  onSubmit() {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;
      for (const key in formData) {
        if (formData[key] && typeof formData[key] === 'string') {
          formData[key] = cleanWhitespace(formData[key]); // Clean each string value
        }
      }
      formData.hadAdminId = Number(localStorage.getItem('UserId'));
      formData.isActive = true;
      formData.status = 'Non-Stock';
      this.inventoryService
        .addinventoryitems(formData)
        .subscribe((response) => {
          Swal.fire({
            icon: 'success',
            title: `${
              formData.id == 0 ? 'Add Success' : 'Update Inventory Item'
            } `,
            text: `${
              formData.id == 0
                ? 'Add Inventory Item Successfully'
                : 'Inventory Item Update Successfully'
            } `,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closeModal();
          });
          this.itemForm.value.id = response;
        });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  //Model Close
  closeModal() {
    const savedItem = {
      name: this.itemForm.value.name,
      id: this.itemForm.value.id,
    };
    // Push the saved item to the savedItems array
    this.savedItems.push(savedItem);
    // Emit the savedItems array
    this.close.emit(this.savedItems);
  }
}
