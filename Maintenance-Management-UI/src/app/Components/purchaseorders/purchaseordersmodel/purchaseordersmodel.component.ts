import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InventoryService } from '../../../Service/inventory.service';
import { InventoryItem } from '../../../Model/InventoryItem.model';
import { FormArray } from '@angular/forms';
import { InventoryitemsmodelComponent } from '../../inventoryitems/inventoryitemsmodel/inventoryitemsmodel.component';
import { PurchaseOrderItem } from '../../../Model/purchaseOrderItem.model';
import { PurchaseOrderService } from '../../../Service/purchaseOrder.service';
import Swal from 'sweetalert2';
import { VendorService } from '../../../Service/vendor.service';
import { response } from 'express';
import { Vendor } from '../../../Model/vendor.model';

@Component({
  selector: 'app-purchaseordersmodel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InventoryitemsmodelComponent],
  templateUrl: './purchaseordersmodel.component.html',
  styleUrl: './purchaseordersmodel.component.css',
})
export class PurchaseordersmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  purchaseorderForm!: FormGroup;
  isedit: boolean = false;
  Openpart: boolean = false;
  selectedItemss: any[] = [];
  selectAll: boolean = false;
  inventoryItems!: InventoryItem[];
  filteredinventoryItems!: InventoryItem[];
  isModalOpen = false;
  vendor!:Vendor[];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private vendorService: VendorService,
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.purchaseorderForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      orderNumber: ['', Validators.required],
      vendorId: [null, Validators.required],
      inventoryItemId: [],
      cost: [],
      quantity: [],
      totalAmount: [null, Validators.required],
      expectedDeliveryDate: ['', Validators.required],
      receivedDate: [null],
      dateCreated: [new Date()],
      createdBy: [],
      status: [],
      name: [],
      selectedItems: this.fb.array([]),
      taxes: ['0.00'], 
      shipping: ['0.00'],
      otherCost: ['0.00'],
      purchaseOrderItems: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    const userId = Number(localStorage.getItem("UserId"));
    this.vendorService.getvendor(userId).subscribe((response) => {
      this.vendor=response;
    });
  }

  onSubmit() {    
    const purchaseOrderItems: PurchaseOrderItem[] = [];

    // Loop through the selected items in the FormArray
    this.selectedItems.controls.forEach(
      (control: AbstractControl, index: number) => {
        const itemGroup = control as FormGroup; // Type cast to FormGroup

        const purchaseOrderItem: PurchaseOrderItem = {
          id: itemGroup.get('id')?.value || 0, // Ensure id is handled if it's part of the model
          itemName: itemGroup.get('name')?.value,
          cost: parseFloat(itemGroup.get('cost')?.value) || 0, // Ensure valid cost
          taxes:itemGroup.get('taxes')?.value,
          quantity: parseInt(itemGroup.get('quantity')?.value, 10) || 0, // Ensure valid quantity
          inventoryItemId: Number(itemGroup.get('inventoryItemId')?.value || 0),
          purchaseOrderId: null,          
        };
        purchaseOrderItems.push(purchaseOrderItem);
      }
    );

    // this.purchaseorderForm.value.totalAmount=this.purchaseorderForm.value.totalAmount;
    if (this.purchaseorderForm.valid) {
      
      const formData = this.purchaseorderForm.value;
      formData.purchaseOrderItems = purchaseOrderItems;
      formData.createdBy = Number(localStorage.getItem('UserId'));
      formData.status = 'Awaiting';
      formData.vendorId = Number(formData.vendorId);
      formData.dateCreated = new Date(Date.now()).toISOString();
      formData.otherCost = 
  (formData.otherCost ? parseFloat(formData.otherCost) : 0) + 
  (formData.shipping ? parseFloat(formData.shipping) : 0) + this.totalTaxes



      this.purchaseOrderService
        .addPurchaseOrder(formData)
        .subscribe((response) => {
          Swal.fire({
            icon: 'success',
            title: `${
              formData.id == 0 ? 'Add Success' : 'Update Purchase Order'
            } `,
            text: `${
              formData.id == 0
                ? 'Add Purchase Order Successfully'
                : 'Purchase Order Update Successfully'
            } `,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closepoModal();
          });
        });
    }
  }

  closepoModal() {
    this.close.emit(); // Emit close event
  }

  closeModal(data?: any) {
    
    this.isModalOpen = false;
    if (data) {
      this.selectedItemss = data; // Assign saved data to selected items
    }
    this.updateSelection(data);
  }
  openaddpart() {
    this.isModalOpen = true;
  }
  openpart() {
    
    const UserId = Number(localStorage.getItem('UserId'));
    this.inventoryService.getinventoryitems(UserId).subscribe((response) => {
      this.inventoryItems = response;
      this.filteredinventoryItems = this.inventoryItems;
      this.Openpart = true;
    });
  }

  // Method to add selected items to the FormArray
  SelectItem(items: any[]) {
    
    if (items && items.length > 0) {
      const selectedItems = this.purchaseorderForm.get(
        'selectedItems'
      ) as FormArray;

      items.forEach((item) => {
        selectedItems.push(
          this.fb.group({
            name: [item.name],
            cost: [item.cost === 'N/A' ? 0 : item.cost],
            quantity: [],
            taxes: [item.taxes],
            inventoryItemId: [item.inventoryItemId],
          })
        );
      });

      this.Openpart = false; // Close modal after selection
    }
  }

  // Helper method to get the FormArray for selected items
  get selectedItems(): FormArray {
    return this.purchaseorderForm.get('selectedItems') as FormArray;
  }

  removeItem(index: number) {
    const selectedItems = this.purchaseorderForm.get(
      'selectedItems'
    ) as FormArray;
    selectedItems.removeAt(index);
  }
  get subtotal(): number {
    const selectedItems = this.purchaseorderForm.get(
      'selectedItems'
    ) as FormArray;
    return selectedItems.controls.reduce((acc, control) => {
      const cost = control.get('cost')?.value || 0;
      const quantity = control.get('quantity')?.value || 0;
      return acc + cost * quantity;
    }, 0);
  }

  get totalAmount(): number {
    
    const shipping =
      parseFloat(this.purchaseorderForm.get('shipping')?.value) || 0;
    const otherCosts =
      parseFloat(this.purchaseorderForm.get('otherCost')?.value) || 0;

    const total = this.subtotal + this.totalTaxes + shipping + otherCosts;

    this.purchaseorderForm
      .get('totalAmount')
      ?.setValue(total, { emitEvent: false });

    return total;
  }
  get totalTaxes(): number {
    let totalTax = 0;  
  const selectedItems = this.purchaseorderForm.get('selectedItems') as FormArray;

  selectedItems.controls.forEach(control => {
    const cost = control.get('cost')?.value || 0;
    const quantity = control.get('quantity')?.value || 0;
    const taxPercentage = control.get('taxes')?.value || 0;

    // Calculate tax: cost * (taxPercentage / 100) * quantity
    const itemTax = (cost * (taxPercentage / 100)) * quantity;

    // Add itemTax to the totalTax
    totalTax += itemTax;
  });

  return totalTax;
  }

  closepartModal() {
    this.Openpart = false;
  }
  toggleAll() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(allCheckboxes).every(
      (checkbox: any) => checkbox.checked
    );

    allCheckboxes.forEach((checkbox: any) => {
      checkbox.checked = !allChecked;
    });

    this.updateSelection(); // Update the selection list
  }
  updateSelection(data?: any) {
    
    if (data) {
      const selectedItems = this.purchaseorderForm.get(
        'selectedItems'
      ) as FormArray;
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          selectedItems.push(
            this.fb.group({
              name: [item.name], // Assuming 'name' is a property of item
              cost: [0], // Assuming cost exists, default to 0
              quantity: [0], // Assuming quantity exists, default to 0
              inventoryItemId: [item.id], // Assuming inventoryItemId exists
            })
          );
        });
      }
    }

    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    this.selectedItemss = Array.from(checkboxes).map((checkbox: any) => {
      const row = checkbox.closest('tr');
      return {
        cost: row?.cells[3]?.textContent.trim(), // Assuming cost is in the 4th column
        quantity: row?.cells[4]?.textContent.trim(), // Assuming quantity is in the 5th column
        name: row?.cells[1]?.textContent.trim(), // Assuming name is in the 2nd column
        inventoryItemId: row?.cells[2]?.textContent.trim(),
      };
    });
  }

}
