import { Component, OnInit } from '@angular/core';
import { PurchaseordersmodelComponent } from './purchaseordersmodel/purchaseordersmodel.component';
import { CommonModule } from '@angular/common';
import { PurchaseOrderService } from '../../Service/purchaseOrder.service';
import { PurchaseOrder } from '../../Model/purchaseOrder.model';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../Service/common.service';
import { PurchaseordersviewmodelComponent } from './purchaseordersviewmodel/purchaseordersviewmodel.component';
import Swal from 'sweetalert2';
import { Filter } from '../../Model/filter.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-purchaseorders',
  standalone: true,
  imports: [
    PurchaseordersmodelComponent,
    CommonModule,
    FormsModule,
    PurchaseordersviewmodelComponent,
    NgxPaginationModule
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
  selectedItem!: number;
  filters: Filter = new Filter();
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page

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
  //View Model Open
  OpenViewmodel(id: number) {
    this.selectedItem = id;
    this.isViewModalOpen = true;
  }
  //Model Open
  openModal(item?:any) {
    this.selectedItem = item;
    this.isModalOpen = true;
  }
  //Model Close
  closeModal() {
    this.isModalOpen = false;
    this.isViewModalOpen = false;
    this.ngOnInit();
  }
  //search purchase order
  searchpurchaseorder() {
    this.showLoader();
    this.filteredpurchaseorder = this.commonService.filterPurchaseOrder(
      this.purchaseorder,
      this.searchTerm
    );
    // this.sortWorkOrder(); // Ensure the results are sorted
  }
  //delete purchase order
  DeletepurchseOrder(id?: number) {
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
          : this.selectedItems
              .map((item) => item.id)
              .filter((id): id is number => id !== undefined);
        this.purchaseOrderService.deletepurchaseorder(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The Purchase Order has been deleted.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745',
            }).then((result) => {
              this.toggleAll();
              this.selectedItems = [];
              this.selectAll = false;
              this.ngOnInit();
            });
          },
          (error) => {
            // Handle deletion failure
            Swal.fire({
              icon: 'warning',
              title: 'Action Not Allowed',
              text: 'Item can not deleted.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
            }).then((result) => {
              this.toggleAll();
              this.selectedItems = [];
              this.selectAll = false;
              this.ngOnInit();
            });
          }
        );
      } else {
        // User cancelled, no action taken
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The PO was not deleted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#17a2b8',
        }).then((result) => {
          this.toggleAll();
          this.selectedItems = [];
          this.selectAll = false;
          this.ngOnInit();
        });
      }
    }); // Close Swal.fire
  }
  //sort purchase order
  sortPO() {
    this.filteredpurchaseorder = this.commonService.sortPO(
      this.filteredpurchaseorder,
      this.sortColumn,
      this.sortOrder
    );
  }
  //sort purchase order
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortPO();
  }
  //Advance Filter of purchase order
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.purchaseOrderService.filterdata(this.filters).subscribe((response) => {
      this.filteredpurchaseorder = response;
    });
  }
  // Updates the `currentPage` variable when the user navigates to a different page in pagination.
  updateSelection() {
    this.selectedItems = this.purchaseorder.filter((item) => item.selected);
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are deselected.
  toggleAll() {
    this.purchaseorder.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  // Updates the `currentPage` variable when the user navigates to a different page in pagination.
  pageChanged(page: number): void {
    this.currentPage = page; // Update current page when pagination changes
  }
  // Sets `isLoading` to true, and then resets it to false after the timeout.
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
}
