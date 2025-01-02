import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VendormodelComponent } from './vendormodel/vendormodel.component';
import { VendorService } from '../../Service/vendor.service';
import { Vendor } from '../../Model/vendor.model';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { VendorviewmodelComponent } from './vendorviewmodel/vendorviewmodel.component';
import { CommonService } from '../../Service/common.service';
import { Filter } from '../../Model/filter.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [
    VendormodelComponent,
    CommonModule,
    FormsModule,
    VendorviewmodelComponent,
    NgxPaginationModule,
  ],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css',
})
export class VendorsComponent implements OnInit {
  isModalOpen = false;
  isViewModalOpen = false;
  vendor!: Vendor[];
  filteredvendor!: Vendor[];
  selectedItems: Vendor[] = [];
  selectedItem: Vendor | null = null;
  selectAll: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  filters: Filter = new Filter();
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default

  constructor(
    private vendorService: VendorService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.showLoader();
    const Id = Number(localStorage.getItem('UserId'));
    this.vendorService.getvendor(Id).subscribe((response) => {
      this.vendor = response;
      this.filteredvendor = this.vendor;
    });
  }
  //Delete vendore
  Deletevendor(id?: number) {
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this Vendor?',
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
        this.vendorService.Deletevendor(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The vendor has been deleted.',
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
              text: 'vendor can not deleted.',
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
          text: 'The vendor was not deleted.',
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
  //View Model Open
  Viewvendor(item: Vendor) {
    this.isViewModalOpen = true;
    this.selectedItem = item || null;
  }
  //model Open
  OpenModal(item: Vendor | null = null) {
    this.isModalOpen = true;
    this.selectedItem = item || null;
  }
  //model close
  closeModal() {
    this.ngOnInit();
    this.isModalOpen = false;
    this.isViewModalOpen = false;
  }
  //search vendor
  searchvendor() {
    this.showLoader();
    this.filteredvendor = this.commonService.filterVendor(
      this.vendor,
      this.searchTerm
    );
  }
  //sort vendor
  sortVendor() {
    this.filteredvendor = this.commonService.sortVendor(
      this.filteredvendor,
      this.sortColumn,
      this.sortOrder
    );
  }
  //sort vendor
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortVendor();
  }
  //Advance Filter of people
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.vendorService.filterdata(this.filters).subscribe((response) => {
      this.filteredvendor = response;
    });
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are deselected.
  toggleAll() {
    this.vendor.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  // Filters the `people` array to include only the items that are selected.
  updateSelection() {
    this.selectedItems = this.vendor.filter((item) => item.selected);
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
