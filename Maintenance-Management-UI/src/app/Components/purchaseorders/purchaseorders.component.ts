import { Component, OnInit } from '@angular/core';
import { PurchaseordersmodelComponent } from './purchaseordersmodel/purchaseordersmodel.component';
import { CommonModule } from '@angular/common';
import { PurchaseOrderService } from '../../Service/purchaseOrder.service';
import { PurchaseOrder } from '../../Model/purchaseOrder.model';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../Service/common.service';
import { PurchaseordersviewmodelComponent } from './purchaseordersviewmodel/purchaseordersviewmodel.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchaseorders',
  standalone: true,
  imports: [
    PurchaseordersmodelComponent,
    CommonModule,
    FormsModule,
    PurchaseordersviewmodelComponent,
  ],
  templateUrl: './purchaseorders.component.html',
  styleUrl: './purchaseorders.component.css',
})
export class PurchaseordersComponent implements OnInit {
  isModalOpen = false;
  purchaseorder!: PurchaseOrder[];
  selectedItems: PurchaseOrder[] = [];
  filteredpurchaseorder!: PurchaseOrder[];
  selectAll: boolean = false;
  isLoading: boolean = false;
  searchTerm: string = '';
  isViewModalOpen = false;
  selectedItem!:number;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.showLoader();
    const UserId = Number(localStorage.getItem('UserId'));
    this.purchaseOrderService.GetPurchaseOrder(UserId).subscribe((response) => {
      this.purchaseorder = response;
      this.filteredpurchaseorder = this.purchaseorder;
    });
  }
  OpenViewmodel(id:number){
    
    this.selectedItem = id;
    this.isViewModalOpen=true;
  }
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.isViewModalOpen = false;
    this.ngOnInit();
  }
  toggleAll() {
    this.purchaseorder.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  updateSelection() {
    this.selectedItems = this.purchaseorder.filter((item) => item.selected);
  }
  searchWorkOrder() {
    this.showLoader();
    this.filteredpurchaseorder = this.commonService.filterPurchaseOrder(
      this.purchaseorder,
      this.searchTerm
    );
    // this.sortWorkOrder(); // Ensure the results are sorted
  }
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
  DeletepurchseOrder(id?:number){
    Swal.fire({
          title: 'Confirm Deletion?',
          text: 'Are you sure you want to delete this Purchase Order?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#d33',
          cancelButtonColor: '#0d6efd',
        }).then((result) => {
          if (result.isConfirmed) {
            
            // User confirmed, proceed with deletion
            const idsToDelete = id
              ? [id]
              : this.selectedItems.map((item) => item.id).filter((id): id is number => id !== undefined);
              this.purchaseOrderService.deletepurchaseorder(idsToDelete)
              .subscribe(
                (response) => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The Purchase Order has been deleted.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745',
                  });
                  this.ngOnInit();
                  this.selectedItems.length = 0;
                },
                (error) => {
                  // Handle deletion failure
                  Swal.fire({
                    icon: 'warning',
                    title: 'Action Not Allowed',
                    text: 'Item can not deleted.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545',
                  });
                }
              );
          }
        }); // Close Swal.fire
  }
}
