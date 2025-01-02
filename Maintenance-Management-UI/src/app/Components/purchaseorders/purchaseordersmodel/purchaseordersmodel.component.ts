import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
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
import { Vendor } from '../../../Model/vendor.model';
import { CommonService } from '../../../Service/common.service';
import {
  futureDateValidator,
  noWhitespaceValidator,
} from '../../validation/custom-validators';
import { distinctUntilChanged } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { PurchaseOrder } from '../../../Model/purchaseOrder.model';
// Custom Validator for FormArray
function minSelectedItems(min: number): ValidatorFn {
  return (control: AbstractControl) => {
    const formArray = control as FormArray;
    const selectedCount = formArray.controls.filter((c) => c.value).length;
    return selectedCount >= min
      ? null
      : { minSelectedItems: { required: min, actual: selectedCount } };
  };
}

@Component({
  selector: 'app-purchaseordersmodel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InventoryitemsmodelComponent,
  ],
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
  vendor!: Vendor[];
  isSubmitting = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  minDate: string;
  ponumberStatus: 'valid' | 'invalid' | 'none' = 'none';
  purchaseorder: PurchaseOrder | null = null;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private vendorService: VendorService,
    private purchaseOrderService: PurchaseOrderService,
    private commonService: CommonService
  ) {
    this.purchaseorderForm = this.fb.group({
      id: [0],
      title: ['', [Validators.required, noWhitespaceValidator]],
      orderNumber: ['', [Validators.required, noWhitespaceValidator]],
      vendorId: [null, Validators.required],
      inventoryItemId: [],
      cost: [],
      quantity: [],
      totalAmount: [null, Validators.required],
      expectedDeliveryDate: ['', [Validators.required, futureDateValidator]],
      receivedDate: [null],
      dateCreated: [new Date()],
      createdBy: [],
      status: [],
      name: [],
      selectedItems: this.fb.array([], minSelectedItems(1)), // Add custom validator here
      taxes: ['0.00'],
      shipping: ['0.00'],
      otherCost: ['0.00'],
      purchaseOrderItems: this.fb.array([]),
    });
    const today = new Date();
    // Format the date as 'YYYY-MM-DD' (this is the format that the <input type="date"> expects)
    this.minDate = today.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    const userId = Number(localStorage.getItem('UserId'));
    this.vendorService.getvendor(userId).subscribe((response) => {
      this.vendor = response;
    });
    this.purchaseorderForm
      .get('orderNumber')
      ?.valueChanges.pipe(
        distinctUntilChanged() // Only trigger when the value actually changes
      )
      .subscribe((value) => {
        this.checkPoNoExists(value);
      });
    this.fetchdata(this.item);
  }
  onCostInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // This will remove non-numeric characters
  }
  fetchdata(item: any) {
    if (this.item) {
      this.purchaseOrderService
        .getByIdpurchaseOrder(this.item)
        .subscribe((response) => {
          this.purchaseorder = response;
          if (response.expectedDeliveryDate) {
            const date = new Date(response.expectedDeliveryDate);
            const formattedDate = `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; // Format to YYYY-MM-DD
            this.purchaseorderForm.patchValue({
              ...response,
              expectedDeliveryDate: formattedDate,
            });
          }
          const selectedItems = this.purchaseorderForm.get(
            'selectedItems'
          ) as FormArray;

          this.purchaseorder.purchaseOrderItems.forEach((item) => {
            selectedItems.push(
              this.fb.group({
                name: [item.itemName],
                cost: [item.cost],
                quantity: [item.quantity],
                taxes: [item.taxes],
                inventoryItemId: [item.inventoryItemId],
              })
            );
          });
          console.log(this.selectedItems);
        });
    }
  }
  //input time check exist
  checkPoNoExists(event: Event): void {
    debugger;
    const input = (event.target as HTMLInputElement)?.value;

    if (!input || this.purchaseorderForm.get('orderNumber')?.invalid) {
      this.ponumberStatus = 'none'; // Reset the status if input is empty
      return;
    }
    const Adminid = Number(localStorage.getItem('UserId'));
    // const poid = this.item?.userID || 0;
    const poid = this.item?.userID || 0;

    this.purchaseOrderService
      .checkPoNoExists(input, Adminid, poid)
      .subscribe((exists: boolean) => {
        this.ponumberStatus = exists ? 'invalid' : 'valid';
      });
  }
  onSubmit() {
    debugger;
    const purchaseOrderItems: PurchaseOrderItem[] = [];
    // Loop through the selected items in the FormArray
    this.selectedItems.controls.forEach(
      (control: AbstractControl, index: number) => {
        const itemGroup = control as FormGroup; // Type cast to FormGroup
        const cost = parseFloat(itemGroup.get('cost')?.value) || 0;
        if (cost > 0) {
          debugger;
          const purchaseOrderItem: PurchaseOrderItem = {
            id: itemGroup.get('id')?.value || 0, // Ensure id is handled if it's part of the model
            itemName: itemGroup.get('name')?.value,
            cost: cost,
            taxes: itemGroup.get('taxes')?.value,
            quantity: parseInt(itemGroup.get('quantity')?.value, 10) || 0, // Ensure valid quantity
            inventoryItemId: Number(
              itemGroup.get('inventoryItemId')?.value || 0
            ),
            purchaseOrderId: null,
          };
          purchaseOrderItems.push(purchaseOrderItem);
        }
      }
    );

    // this.purchaseorderForm.value.totalAmount=this.purchaseorderForm.value.totalAmount;
    if (this.purchaseorderForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.purchaseorderForm.value;
      formData.purchaseOrderItems = purchaseOrderItems;
      formData.createdBy = Number(localStorage.getItem('UserId'));
      formData.status = 'Awaiting';
      formData.vendorId = Number(formData.vendorId);
      formData.dateCreated = new Date(Date.now()).toISOString();
      formData.otherCost =
        (formData.otherCost ? parseFloat(formData.otherCost) : 0) +
        (formData.shipping ? parseFloat(formData.shipping) : 0);
      //+this.totalTaxes;

      this.purchaseOrderService.addPurchaseOrder(formData).subscribe({
        next: (response: number) => {
          if (response === 0) {
            // Show SweetAlert for failure
            Swal.fire({
              icon: 'error',
              title: 'Duplicate PO Number',
              text: 'A Order with this PO Number already exists in your List.',
              confirmButtonColor: '#d33',
            }).then(() => {
              this.purchaseorderForm.reset();
              this.ponumberStatus = 'none';
            });
          } else {
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
              this.isSubmitting = false;
            });
          }
        },
        error: (error: HttpErrorResponse) => {},
      });
    } else {
      this.purchaseorderForm.markAllAsTouched();
    }
  }
  //search item
  searchitem() {
    debugger;
    this.showLoader();
    this.filteredinventoryItems = this.commonService.filterInventoryItem(
      this.inventoryItems,
      this.searchTerm
    );
  }
  //Close purchase order model
  closepoModal() {
    this.close.emit(); // Emit close event
  }
  //Model Close
  closeModal(data?: any) {
    this.isModalOpen = false;
    if (data) {
      this.selectedItemss = data; // Assign saved data to selected items
    }
    this.updateSelection(data);
  }
  //Open Model for select inventory Item
  openaddpart() {
    this.isModalOpen = true;
  }
  //Close Model for select inventory Item
  closepartModal() {
    this.Openpart = false;
  }
  //Get data for select inventory
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
  // remove Items from the selected table
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
    const selectedItems = this.purchaseorderForm.get(
      'selectedItems'
    ) as FormArray;
    selectedItems.controls.forEach((control) => {
      const cost = control.get('cost')?.value || 0;
      const quantity = control.get('quantity')?.value || 0;
      const taxPercentage = control.get('taxes')?.value || 0;
      const itemTax = cost * (taxPercentage / 100) * quantity;
      totalTax += itemTax;
    });
    return totalTax;
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are desele
  toggleAll(event: Event) {
    debugger;
    const isChecked = (event.target as HTMLInputElement).checked; // Get the state of the parent checkbox

    // Select all child checkboxes
    const allCheckboxes = Array.from(
      document.querySelectorAll('input[type="checkbox"]')
    ) as HTMLInputElement[];

    // Update each child checkbox state based on parent checkbox state
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });

    this.updateSelection(); // Update the selection list
  }
  // Filters the `people` array to include only the items that are selected.
  updateSelection(data?: any) {
    debugger;
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
  // Sets `isLoading` to true, and then resets it to false after the timeout.
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
}
