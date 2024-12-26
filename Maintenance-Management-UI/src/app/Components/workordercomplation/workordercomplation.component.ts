import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { PaymentComponent } from '../paymentsmanage/payment/payment.component';
import { Workorder } from '../../Model/workorder.model';
import Swal from 'sweetalert2';
import { WorkOrderService } from '../../Service/workorder.service';
import { NotificationService } from '../../Service/notification.service';
import { Notification } from '../../Model/notification.model';
import { LocationService } from '../../Service/location.service';
import { AssetsService } from '../../Service/assets.service';
import { Asset } from '../../Model/asset.model';
import { Location } from '../../Model/Location.model';
import { InventoryItem } from '../../Model/InventoryItem.model';
import { InventoryService } from '../../Service/inventory.service';
import { MaintenanceItem } from '../../Model/maintenanceItem.model';

@Component({
  selector: 'app-workordercomplation',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, PaymentComponent],
  templateUrl: './workordercomplation.component.html',
  styleUrl: './workordercomplation.component.css',
  providers: [DecimalPipe],
})
export class WorkordercomplationComponent {
  @Input() item!: Workorder;
  @Output() close = new EventEmitter<void>();
  workorder: Workorder = new Workorder();
  location!: Location[];
  assets: Asset[] = [];
  activeTab: string = 'task';
  completedWorkOrderForm!: FormGroup;
  selectedItem: any;
  showStripePayment: boolean = false;
  Openpart: boolean = false;
  filteredinventoryItems!: InventoryItem[];
  selectedItemss: any[] = [];
  inventoryItems!: InventoryItem[];
  totalCost: number = 0;
  totalQuantity: number = 0;
  totalTaxes: number = 0;
  statusOptions = [
    { value: 'Open' },
    { value: 'In Progress' },
    { value: 'On Hold' },
    { value: 'Complete' },
  ];
  constructor(
    private workOrderService: WorkOrderService,
    private notificationService: NotificationService,
    private locationService: LocationService,
    private assetsService: AssetsService,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private decimalPipe: DecimalPipe
  ) {}

  ngOnInit(): void {
    
    if (this.item) {
      
      this.workorder = { ...this.item }; // Populate with selected item data for editing
      this.item.assignedTo = this.workorder.assignedTo;
      this.workorder.location = Number(this.workorder.location);
    } else {
      this.workorder.createdBy;
    }
    const role = localStorage.getItem('Role') || '';
    if (role == 'Employee') {
      //this.employee = true;
    }
    this.completedWorkOrderForm = this.fb.group(
      {
        id: [0],
        workOrderId: [''],
        status: [this.item?.status || ''],
        proofOfCompletion: ['', [Validators.required]],
        notesComments: ['', [Validators.required, Validators.minLength(5)]],
        descriptionOfOccurrence: [
          '',
          [Validators.required, Validators.minLength(10)],
        ],
        challengesEncountered: ['', Validators.maxLength(500)],
        sparePartsMaterialsUsed: ['', Validators.maxLength(200)],
        extraWorkDetails: ['', Validators.maxLength(500)],
        planDeviations: ['', Validators.maxLength(200)],
        actualLaborHours: [0, [Validators.required, Validators.min(1)]],
        workHours: [],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        selectedItems: this.fb.array([]),
        selectquantity: [],       
        maintenanceItem: this.fb.array([]),
      },
      { validators: this.workHoursValidator }
    );
    const hadId = Number(localStorage.getItem('UserId'));
    this.locationService.Getlocation(hadId).subscribe((response) => {
      this.location = response;
    });
    this.assetsService.GetAssets(hadId).subscribe((response) => {
      this.assets = response;
    });
  }
  workHoursValidator(control: AbstractControl): ValidationErrors | null {
    const actualLaborHours = control.get('actualLaborHours')?.value;
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!actualLaborHours || !startTime || !endTime) {
      return null; // If any value is missing, don't check duration yet.
    }
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours

    if (duration > 12) {
      return null;
    }
    // Check if the duration matches the actualLaborHours
    if (duration !== actualLaborHours) {
      return { invalidDuration: true };
    }

    return null; // No errors
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  onSubmit(id: number) {
    
    const maintenanceItems: MaintenanceItem[] = [];
    this.selectedItems.controls.forEach((control: AbstractControl, index: number) => {
      const itemGroup = control as FormGroup; // Type cast to FormGroup
  
      const maintenanceItem: MaintenanceItem = {
        id: itemGroup.get('id')?.value || 0, // Ensure id is handled if it's part of the model
        name: itemGroup.get('name')?.value,
        cost: parseFloat(itemGroup.get('cost')?.value) || 0, // Ensure valid cost
        tax: parseFloat(itemGroup.get('taxes')?.value) || 0,
        quantity: parseInt(itemGroup.get('selectquantity')?.value, 10) || 0, // Use the updated selectquantity
        inventoryItemId: Number(itemGroup.get('inventoryItemId')?.value || 0),
        completedWorkOrderId: null,
      };
      maintenanceItems.push(maintenanceItem);
    });

    if (this.completedWorkOrderForm.valid) {
      const formData = this.completedWorkOrderForm.value;
      formData.workOrderId = id;
      formData.maintenanceItem = maintenanceItems;
      const startTime = this.completedWorkOrderForm.get('startTime')?.value;
      const endTime = this.completedWorkOrderForm.get('endTime')?.value;
      formData.workHours = `${startTime} - ${endTime}`;
      this.workOrderService
        .completeworkorder(formData)
        .subscribe((response) => {
          const data = new Notification();
          data.id = 0;
          data.message = `Work order #${id} has been marked as ${formData.status}`;
          data.isRead = false;
          data.senderID = Number(localStorage.getItem('UserId'));
          data.reciverId = Number(localStorage.getItem('HadAdminId'));
          this.notificationService.SendMessage(data).subscribe((response) => {
            console.log(response);
          });
          // this.closeModal();
          Swal.fire({
            icon: 'success',
            title: 'Submitted  Successfully',
            text: 'Work Order Status Update Successfully',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            
            // Close the modal after the user clicks "OK"
            // this.closeModal();
            this.item.estimatedCost = this.totalAmountToPay;
            if(this.item.estimatedCost <=0){
              this.closeModal();
            }
            else{
              this.showStripePayment = true;
              if (formData.status === 'Complete') {
                
                this.setActiveTab('payment');
              } 
              this.showStripePayment = true;           
            }
              this.closeModal();
            
          });
        });
    } else {
    }
  }
  onStatusChange(event: any, item: any): void {    
    const status = event.target.value;
    if (status === 'Complete') {
      this.selectedItem = item;
    }
  }
  closeModal() {    
    this.close.emit(); // Emit close event    
  }
  closepartModal() {
    this.Openpart = false;
  }
  openpart() {    
    const UserId = Number(localStorage.getItem('HadAdminId'));
    this.inventoryService.getinventory(UserId).subscribe((response) => {
      this.inventoryItems = response;
      this.filteredinventoryItems = this.inventoryItems;
      console.log(response);
      this.Openpart = true;
    });
  }
  get selectedItems(): FormArray {
    return this.completedWorkOrderForm.get('selectedItems') as FormArray;
  }
  removeItem(index: number) {
    const selectedItems = this.completedWorkOrderForm.get(
      'selectedItems'
    ) as FormArray;
    selectedItems.removeAt(index);
    this.updateTotalCost();
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
    
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    this.selectedItemss = Array.from(checkboxes).map((checkbox: any) => {
      const row = checkbox.closest('tr');
      return {
        cost: row?.cells[3]?.textContent.trim(), // Cost is in the 4th column (index 3)
        quantity: row?.cells[5]?.textContent.trim(), // Quantity is in the 6th column (index 5)
        name: row?.cells[1]?.textContent.trim(), // Name is in the 2nd column (index 1)
        inventoryItemId: row?.cells[2]?.textContent.trim(), // Item ID is in the 3rd column (index 2)
        taxes: row?.cells[4]?.textContent.trim(),
      };
    });
  }
  SelectItem(items: any[]) {
    
    if (items && items.length > 0) {
      const selectedItems = this.completedWorkOrderForm.get(
        'selectedItems'
      ) as FormArray;

      items.forEach((item) => {
        selectedItems.push(
          this.fb.group({
            name: [item.name],
            cost: [item.cost === 'N/A' ? 0 : item.cost],
            taxes: [item.taxes],
            quantity: [item.quantity],
            inventoryItemId: [item.inventoryItemId],
            originalQuantity: [item.quantity], // Store the initial quantity
            remainingQuantity: [item.quantity], // For display purposes
            selectquantity: [1],
          })
        );
      });
      this.updateTotalCost();

      this.Openpart = false; // Close modal after selection
    }
  }
  updateTotalCost(): void {
    this.totalCost = 0;
    this.totalQuantity = 0;
    this.totalTaxes = 0;

    this.selectedItems.controls.forEach((control) => {
      const initialQuantity = control.get('originalQuantity')?.value || 0; // Store the original quantity
      const selectQuantity = control.get('selectquantity')?.value || 0;

    
      // Calculate the remaining quantity
      const remainingQuantity = initialQuantity - selectQuantity;

      // Update the control with the remaining quantity
      control.get('remainingQuantity')?.setValue(remainingQuantity);

      // Update totals
      const cost = control.get('cost')?.value || 0;
      this.totalCost += cost * selectQuantity;
      this.totalQuantity += selectQuantity; 

      const taxPercentage = control.get('taxes')?.value || 0;
      const taxPerItem = cost * (taxPercentage / 100) * selectQuantity;
      this.totalTaxes += taxPerItem;
    });
  }
  validateQuantity(index: number, selectedQuantity: number): void {
    const remainingQuantity = this.selectedItems.at(index).get('originalQuantity')?.value || 0;
  
    if (selectedQuantity > remainingQuantity) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Quantity',
        text: `You cannot select more than ${remainingQuantity}.`,
        confirmButtonText: 'OK'
      });
  
      // Reset the value back to the remaining quantity
      this.selectedItems.at(index).get('selectquantity')?.setValue(remainingQuantity);
    } else {
      // Update the total cost if the quantity is valid
      this.updateTotalCost();
    }
  }
  

  get totalAmountToPay(): number {
    const estimatedCost = parseFloat(
      this.item.estimatedCost?.toString() || '0'
    );
    return estimatedCost + this.totalCost + this.totalTaxes;
  }
}
