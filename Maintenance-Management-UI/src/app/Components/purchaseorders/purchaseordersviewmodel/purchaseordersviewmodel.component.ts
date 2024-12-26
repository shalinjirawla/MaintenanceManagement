import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PurchaseOrderService } from '../../../Service/purchaseOrder.service';
import { PurchaseOrder } from '../../../Model/purchaseOrder.model';
import { response } from 'express';
import { InventoryService } from '../../../Service/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchaseordersviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchaseordersviewmodel.component.html',
  styleUrl: './purchaseordersviewmodel.component.css',
})
export class PurchaseordersviewmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  purchaseorder: PurchaseOrder | null = null;
  Openfulfill: boolean = false;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private inventoryService: InventoryService
  ) {}
  ngOnInit(): void {
    if (this.item) {
      this.purchaseOrderService
        .getByIdpurchaseOrder(this.item)
        .subscribe((response) => {
          this.purchaseorder = response;
          console.log(response);
        });
    }
  }
  get subtotal(): number {
    return (
      this.purchaseorder?.purchaseOrderItems?.reduce((total, item) => {
        return total + item.cost * item.quantity;
      }, 0) || 0
    );
  }
  PurchaseOrderStatus(status: string, id: number) {
    
    if (status == 'Awaiting') {
      this.purchaseOrderService
        .UpdatePurchseorderStatus('Approved', id)
        .subscribe((response) => {
          Swal.fire({
            icon: 'success',
            title: 'successfully Approved.',
            text: 'Purchase Order successfully Approved.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closeModal();
          });
        });
    } else if (status == 'Approved') {
      this.Openfulfill = true;
    }
  }
  onFulfill() {
    
    // Prepare the array of objects to send to the backend
    const dataToSend = this.purchaseorder?.purchaseOrderItems.map((item) => ({
      id: item.inventoryItemId,
      poitemid: item.id,
    }));

    this.inventoryService.FulfillQuantity(dataToSend).subscribe((response) => {
      
      console.log(response);
      this.purchaseOrderService
        .UpdatePurchseorderStatus('Fulfilled', this.item)
        .subscribe((response) => {
          
          Swal.fire({
            icon: 'success',
            title: 'successfully Fulfill.',
            text: 'Purchase Order successfully fulfill.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closefulfillModal();
            this.closeModal();
          });
          
        });
    });
  }
  closefulfillModal() {
    this.Openfulfill = false;
  }
  closeModal() {
    this.close.emit(); // Emit close event
  }
}
