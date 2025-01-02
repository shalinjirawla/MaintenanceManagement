import { Component, OnInit } from '@angular/core';
import { Location } from '../../Model/Location.model';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../Service/location.service';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../Service/common.service';
import { LocationmodelComponent } from './locationmodel/locationmodel.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LocationviewmodelComponent } from './locationviewmodel/locationviewmodel.component';
import { Filter } from '../../Model/filter.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    LocationmodelComponent,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    LocationviewmodelComponent,
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
})
export class LocationComponent implements OnInit {
  isModalOpen = false;
  isViewModalOpen = false;
  selectedItem: Location | null = null;
  location!: Location[];
  searchTerm: string = '';
  filteredlocation!: Location[];
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  isLoading: boolean = false;
  filters: Filter = new Filter();
  selectedItems: Location[] = [];
  selectAll: boolean = false;

  constructor(
    private locationService: LocationService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.showLoader();
    const Role =
      typeof localStorage !== 'undefined' ? localStorage.getItem('Role') : null;

    if (Role == 'Admin') {
      const adminid = Number(localStorage.getItem('UserId'));
      this.locationService.Getlocation(adminid).subscribe((response) => {
        this.location = response;
        this.filteredlocation = this.location;
      });
    } else {
      this.locationService.GetAlllocation().subscribe((response) => {
        this.location = response;
        this.filteredlocation = this.location;
      });
    }
  }
  //Delete selected Location one or multiple
  Deletelocation(id?: number) {
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this Request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0d6efd',
    }).then((result) => {
      if (result.isConfirmed) {
        // Determine IDs to delete and filter out undefined
        const idsToDelete = id
          ? [id]
          : this.selectedItems
              .map((item) => item.id)
              .filter((id) => id !== undefined);

        // Proceed with deletion
        this.locationService.deleteLocation(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The Request has been deleted.',
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
              text: 'Request cannot be deleted.',
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
          text: 'The Request was not deleted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#17a2b8',
        }).then((result) => {
          this.toggleAll();
          this.selectedItems = [];
          this.selectAll = false;
          this.ngOnInit();
        });
      }
    });
  }
  //Model open
  openModal(item: Location | null = null) {
    this.selectedItem = item || null;
    this.isModalOpen = true;
  }
  //Model open
  openviewModal(item: any) {
    this.selectedItem = item || null;
    this.isViewModalOpen = true;
  }
  //Model Close
  closeModal() {
    this.isModalOpen = false;
    this.isViewModalOpen = false;
    this.ngOnInit();
  }
  //Search Location
  searchlocation() {
    this.showLoader();
    this.filteredlocation = this.commonService.filterLocation(
      this.location,
      this.searchTerm
    );
    //this.sortasset(); // Ensure the results are sorted
  }
  //sort Location
  sortBy(column: string) {}
  //Advance Filter of Location
  applyFilters() {
    debugger;
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.locationService.filterdata(this.filters).subscribe((response) => {
      this.filteredlocation = response;
    });
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are deselected.
  toggleAll() {
    this.location.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  // Filters the `workorder` array to include only the items that are selected.
  updateSelection() {
    this.selectedItems = this.location.filter((item) => item.selected);
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
