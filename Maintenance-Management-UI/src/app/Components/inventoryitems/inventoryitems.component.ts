import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InventoryItem } from '../../Model/InventoryItem.model';
import { InventoryitemsmodelComponent } from './inventoryitemsmodel/inventoryitemsmodel.component';
import { InventoryService } from '../../Service/inventory.service';
import { CommonService } from '../../Service/common.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { InventoryitemsviewmodelComponent } from './inventoryitemsviewmodel/inventoryitemsviewmodel.component';
import { Filter } from '../../Model/filter.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-inventoryitems',
  standalone: true,
  imports: [
    CommonModule,
    InventoryitemsmodelComponent,
    FormsModule,
    InventoryitemsviewmodelComponent,
    NgxPaginationModule,
  ],
  templateUrl: './inventoryitems.component.html',
  styleUrl: './inventoryitems.component.css',
})
export class InventoryitemsComponent implements OnInit {
  isModalOpen = false;
  isViewModalOpen = false;
  inventoryItems!: InventoryItem[];
  filteredinventoryItems!: InventoryItem[];
  selectedItems: InventoryItem[] = [];
  selectedItem: InventoryItem | null = null;
  selectAll: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  filters: Filter = new Filter();
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page

  constructor(
    private inventoryService: InventoryService,
    private commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.showLoader();
    const UserId = Number(localStorage.getItem('UserId'));
    this.inventoryService.getinventoryitems(UserId).subscribe((response) => {
      this.inventoryItems = response;
      this.filteredinventoryItems = this.inventoryItems;
    });
  }
  DeleteItems(id?: number) {
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this Item?',
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
          : this.selectedItems.map((item) => item.id);
        this.inventoryService.Deleteinventoryitem(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The Item has been deleted.',
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
          text: 'The Item was not deleted.',
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
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.inventoryService.filterdata(this.filters).subscribe((response) => {
      this.filteredinventoryItems = response;
    });
  }
  openModal(item?: InventoryItem) {
    this.isModalOpen = true;
    this.selectedItem = item || null;
  }
  ViewItem(item?: InventoryItem) {
    this.isViewModalOpen = true;
    this.selectedItem = item || null;
  }
  closeModal() {
    this.isModalOpen = false;
    this.isViewModalOpen = false;
    this.ngOnInit();
  }
  toggleAll() {
    this.inventoryItems.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  updateSelection() {
    this.selectedItems = this.inventoryItems.filter((item) => item.selected);
  }
  searchInventoryItems() {
    this.showLoader();
    this.filteredinventoryItems = this.commonService.filterInventoryItem(
      this.inventoryItems,
      this.searchTerm
    );
  }
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortRequests();
  }
  sortRequests() {
    this.filteredinventoryItems = this.commonService.sortInventoryItem(
      this.filteredinventoryItems,
      this.sortColumn,
      this.sortOrder
    );
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
