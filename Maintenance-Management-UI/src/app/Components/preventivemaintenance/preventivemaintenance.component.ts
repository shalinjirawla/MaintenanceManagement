import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreventivemodelComponent } from './preventivemodel/preventivemodel.component';
import { PreventivemaintananceService } from '../../Service/preventivemaintanance.service';
import { PreventiveMaintenance } from '../../Model/PreventiveMaintenance.model';
import { CommonService } from '../../Service/common.service';
import { PreventiveviewmodelComponent } from './preventiveviewmodel/preventiveviewmodel.component';
import test from 'node:test';
import { NgxPaginationModule } from 'ngx-pagination';
import { Filter } from '../../Model/filter.model';
import { UserService } from '../../Service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preventivemaintenance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PreventivemodelComponent,
    FormsModule,
    PreventiveviewmodelComponent,
    NgxPaginationModule,
  ],
  templateUrl: './preventivemaintenance.component.html',
  styleUrl: './preventivemaintenance.component.css',
})
export class PreventivemaintenanceComponent implements OnInit {
  isModalOpen = false;
  isViewModalOpen = false;
  preventiveMaintenance!: PreventiveMaintenance[];
  searchTerm: string = '';
  filteredPM!: PreventiveMaintenance[];
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  selectedItem: any;
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 12; // Items per page
  isLoading: boolean = false;
  filters: Filter = new Filter();
  selectedItems: PreventiveMaintenance[] = [];
  selectAll: boolean = false;

  constructor(
    private preventiveMaintenanceService: PreventivemaintananceService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.showLoader();
    const Role =
    typeof localStorage !== 'undefined' ? localStorage.getItem('Role') : null;

  if (Role == 'Admin') {

    const userId =
      typeof localStorage !== 'undefined'
        ? Number(localStorage.getItem('UserId'))
        : null;
    const roleId =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('Role')
        : null;

    if (roleId && userId)
          
    this.preventiveMaintenanceService
      .GetAllPreventiveMaintenance(userId)
      .subscribe((response) => {
        
        this.preventiveMaintenance = response;
        this.filteredPM = this.preventiveMaintenance;
      });
    } else {
      this.preventiveMaintenanceService.GetAll().subscribe((response) => {
        this.preventiveMaintenance = response;
        this.filteredPM = this.preventiveMaintenance;
      });
    }
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
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.preventiveMaintenanceService
      .filterdata(this.filters)
      .subscribe((response) => {
        this.filteredPM = response;
      });
  }
  searchPM() {
    this.showLoader();
    this.filteredPM = this.commonService.filterPM(
      this.preventiveMaintenance,
      this.searchTerm
    );
    this.sortPM(); // Ensure the results are sorted
  }
  sortPM() {
    this.filteredPM = this.commonService.sortPM(
      this.filteredPM,
      this.sortColumn,
      this.sortOrder
    );
  }
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortPM();
  }
  openModal(item: any | undefined) {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.ngOnInit();
  }
  closeviewModal() {
    this.isViewModalOpen = false;
  }
  openViewModal(item: PreventiveMaintenance) {
    this.selectedItem = item || null;
    this.isViewModalOpen = true;
  }

  deletePreventiveMaintenance(id?: number): void {
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this PM?',
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
       this.preventiveMaintenanceService.deletePreventiveMaintenance(idsToDelete).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The PM has been deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
          });
          this.ngOnInit();
        }, error => {
          // Handle deletion failure
          Swal.fire({ 
            icon: 'warning',
            title: 'Action Not Allowed',
            text: 'PM cannot be deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
        
        });
      } else {
        // User cancelled, no action taken
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The PM was not deleted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#17a2b8'
        });
      }
    });

  }
  toggleAll() {
    this.preventiveMaintenance.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  updateSelection() {
    this.selectedItems = this.preventiveMaintenance.filter((item) => item.selected);
  }
}
