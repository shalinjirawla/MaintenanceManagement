import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../Service/common.service';
import { Inventorycategories } from '../../Model/InventoryCategory.model';
import { InventorycategoriesmodelComponent } from './inventorycategoriesmodel/inventorycategoriesmodel.component';
import { InventorycategoryviewmodelComponent } from './inventorycategoryviewmodel/inventorycategoryviewmodel.component';
import { InventoryService } from '../../Service/inventory.service';
import { Filter } from '../../Model/filter.model';

@Component({
  selector: 'app-inventorycategories',
  standalone: true,
  imports: [InventorycategoriesmodelComponent,
    InventorycategoryviewmodelComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventorycategories.component.html',
  styleUrl: './inventorycategories.component.css',
})
export class InventorycategoriesComponent implements OnInit {
  isModalOpen = false;
  isViewModalOpen = false;
  inventorycategory!: Inventorycategories[];
  filteredinventorycategory!: Inventorycategories[];
  selectedItems: Inventorycategories[] = [];
  selectedItem: Inventorycategories | null = null;
  selectAll: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  filters: Filter = new Filter();
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private inventoryService: InventoryService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.showLoader();
    const userid = Number(localStorage.getItem('UserId'));
    this.inventoryService
      .getinventorycategoty(userid)
      .subscribe((response) => {
        this.inventorycategory = response;
        this.filteredinventorycategory = this.inventorycategory;
      });
  }
  DeleteInventoryCategory(id?: number) {
    
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this Category?',
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
        this.inventoryService
          .Deleteinventorycategoty(idsToDelete)
          .subscribe(
            (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The Category has been deleted.',
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
                text: 'Category can not deleted.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
              });
            }
          );
      }
    }); // Close Swal.fire
  }
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.inventoryService.filtercategorydata(this.filters).subscribe((response) => {
    this.filteredinventorycategory = response;
    });
  }
  openModal(item?: Inventorycategories) {
    
    this.isModalOpen = true;
    this.selectedItem = item || null;
  }
  closeModal() {
    this.isModalOpen = false;
    this.isViewModalOpen = false;
    this.ngOnInit();
  }
  openViewModel(item: Inventorycategories) {
    
    this.isViewModalOpen = true;
    this.selectedItem = item || null;
  }
  toggleAll() {
    this.inventorycategory.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  updateSelection() {
    this.selectedItems = this.inventorycategory.filter((item) => item.selected);
  }
  searchInventoryCategory() {
    this.showLoader();
    this.filteredinventorycategory = this.commonService.filterInventoryCategory(
      this.inventorycategory,
      this.searchTerm
    );
  }
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
}
