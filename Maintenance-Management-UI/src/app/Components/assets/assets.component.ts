import { Component, OnInit } from '@angular/core';
import { AssetsmodelComponent } from './assetsmodel/assetsmodel.component';
import { CommonModule } from '@angular/common';
import { Login } from '../../Model/login.model';
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
  itemsPerPage: number = 6; // Items per page
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
  pageChanged(page: number): void {
    this.currentPage = page; // Update current page when pagination changes
  }
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
  openModal(item: Asset | null = null, mode: 'edit' | 'view' | 'add') {
    this.selectedItem = item || null;
    this.modalMode = mode;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.ngOnInit();
  }
  toggleAll() {
    this.assets.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  updateSelection() {
    this.selectedItems = this.assets.filter((item) => item.selected);
  }
  clearSelection() {
    this.assets.forEach((item) => (item.selected = false));
    this.selectedItems = []; // Clear the selectedItems array
    this.selectAll = false;
  }
  deleteassets(id?:number) {
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
        const idsToDelete = id ? [id] : this.selectedItems.map((item) => item.id);       
       // const idsToDelete = this.selectedItems.map((item) => item.id);
        this.assetsService.deleteAsset(idsToDelete).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The Asset has been deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
          });
          this.ngOnInit();
          this.selectedItems=[];
        }, error => {
          // Handle deletion failure
          Swal.fire({
            icon: 'warning',
            title: 'Action Not Allowed',
            text: 'Asset cannot be deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
        
        });
      } else {
        // User cancelled, no action taken
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The Asset was not deleted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#17a2b8'
        });
      }
    });
  
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortasset();
  }
  searchasset() {
    this.showLoader();
    this.filteredassets = this.commonService.filterAsset(
      this.assets,
      this.searchTerm
    );
    this.sortasset(); // Ensure the results are sorted
  }
  sortasset() {
    this.filteredassets = this.commonService.sortAsset(
      this.filteredassets,
      this.sortColumn,
      this.sortOrder
    );
  }
  applyFilters() {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.assetsService.filterdata(this.filters).subscribe((response) => {
      this.filteredassets = response;
    });
  }
  openImageModal(imageSrc: string): void {
    this.selectedImage = imageSrc;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
}
