import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { response } from 'express';
import Swal from 'sweetalert2';
import { Inventorycategories } from '../../../Model/InventoryCategory.model';
import { InventoryService } from '../../../Service/inventory.service';

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
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {
    this.categoryForm = fb.group({
      id: [0],
      categoryName: ['', Validators.required],
      description: ['', Validators.required],
      hadAdminId: [],
      isActive: [],
    });
  }
  ngOnInit(): void {
    
    if(this.item){
      this.categoryForm.patchValue(this.item);
    }
  }
  onSubmit() {
    
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
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
    }
    else{
      this.categoryForm.markAllAsTouched();  
    }
  }
  closeModal() {
    this.close.emit(); // Emit close event
  }
}
