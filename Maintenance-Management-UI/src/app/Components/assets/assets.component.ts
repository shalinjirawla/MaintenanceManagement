import { Component, OnInit } from '@angular/core';
import { AssetsmodelComponent } from './assetsmodel/assetsmodel.component';
import { CommonModule } from '@angular/common';
import { AssetsService } from '../../Service/assets.service';
import { Asset } from '../../Model/asset.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../Service/common.service';
import { Filter } from '../../Model/filter.model';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    AssetsmodelComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css',
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];
  isModalOpen = false;
  selectedItems: Asset[] = [];
  selectAll: boolean = false;
  selectedItem: Asset | null = null;
  searchTerm: string = '';
  filteredassets!: Asset[];
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  filters: Filter = new Filter();
  modalMode: 'edit' | 'view' | 'add' = 'add'; // Add modalMode property
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 9; // Items per page
  isLoading: boolean = false;
  selectedImage: string | null = null;

  constructor(
    private assetsService: AssetsService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.showLoader();
    const id = Number(localStorage.getItem('UserId'));
    this.assetsService.GetAssets(id).subscribe((response) => {
      this.assets = response;
      this.filteredassets = this.assets;
    });
  }

  //Delete selected assets one or multiple
  deleteassets(id?: number) {
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this Asset?',
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
        // const idsToDelete = this.selectedItems.map((item) => item.id);
        this.assetsService.deleteAsset(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The Asset has been deleted.',
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
              text: 'Asset cannot be deleted.',
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
          text: 'The Asset was not deleted.',
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
  //Model Open
  openModal(item: Asset | null = null, mode: 'edit' | 'view' | 'add') {
    this.selectedItem = item || null;
    this.modalMode = mode;
    this.isModalOpen = true;
  }
  //Image Model Open
  openImageModal(imageSrc: string): void {
    this.selectedImage = imageSrc;
  }
  //Model Close
  closeModal() {
    this.isModalOpen = false;
    this.ngOnInit();
  }
  //Image Model Close
  closeImageModal(): void {
    this.selectedImage = null;
  }
  //Search assets
  searchasset() {
    this.showLoader();
    this.filteredassets = this.commonService.filterAsset(
      this.assets,
      this.searchTerm
    );
    this.sortasset(); // Ensure the results are sorted
  }
  //sort assets
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortasset();
  }
  //sort assets
  sortasset() {
    this.filteredassets = this.commonService.sortAsset(
      this.filteredassets,
      this.sortColumn,
      this.sortOrder
    );
  }
  //Advance Filter of assets
  applyFilters() {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.assetsService.filterdata(this.filters).subscribe((response) => {
      this.filteredassets = response;
    });
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are deselected.
  toggleAll() {
    this.assets.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  // Filters the `assets` array to include only the items that are selected.
  updateSelection() {
    this.selectedItems = this.assets.filter((item) => item.selected);
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
