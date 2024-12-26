import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkOrderService } from '../../Service/workorder.service';
import { Workorder } from '../../Model/workorder.model';
import { CommonService } from '../../Service/common.service';
import { WorkordermodelComponent } from './workordermodel/workordermodel.component';
import { Filter } from '../../Model/filter.model';
import { WorkorderreviewmodelComponent } from './workorderreviewmodel/workorderreviewmodel.component';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { WorkorderviewmodelComponent } from './workorderviewmodel/workorderviewmodel.component';
import { WorkOrderCompletion } from '../../Model/workOrderCompletion .model';
import { WorkordercomplationComponent } from '../workordercomplation/workordercomplation.component';

@Component({
  selector: 'app-workorder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkordermodelComponent,
    WorkorderreviewmodelComponent,
    WorkorderviewmodelComponent,
    NgxPaginationModule,
    WorkordercomplationComponent
  ],
  templateUrl: './workorder.component.html',
  styleUrl: './workorder.component.css',
})
export class WorkorderComponent implements OnInit {
  // Define the mapping of category numbers to their corresponding names
  categoryMapping: { [key: string]: string } = {
    '1': 'Damage',
    '2': 'Electrical',
    '3': 'Inspection',
    '4': 'Meter Reading',
    '5': 'Safety',
  };

  selectedItem: any;
  isModalOpen = false;
  items: [] = [];
  workorder!: Workorder[];
  searchTerm: string = '';
  filteredWorkOrder!: Workorder[];
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  EditworkorderModalOpen = false;
  ComplationworkorderModalOpen = false;
  ReviewworkorderModalOpen = false;
  workorderviewModalOpen = false;
  filters: Filter = new Filter();
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  isLoading: boolean = false;
  employee: boolean = false;
  selectedItems: Workorder[] = [];
  selectAll: boolean = false;
  constructor(
    private WorkOrderService: WorkOrderService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    
    this.showLoader();
    const Role =
      typeof localStorage !== 'undefined' ? localStorage.getItem('Role') : null;

    if (Role == 'Admin' || Role == 'Employee') {

      if (Role == 'Employee') {
        this.employee = true;       
      }
      const userId =
        typeof localStorage !== 'undefined'
          ? Number(localStorage.getItem('UserId'))
          : null;
      const roleId =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem('Role')
          : null;

      if (roleId && userId)
        this.WorkOrderService.GetByRoleIdWorkOrder(userId, roleId).subscribe(
          (response) => {
            this.workorder = response;
            this.filteredWorkOrder = this.workorder;
          }
        );
    } else {
      this.WorkOrderService.GetAllWorkOrder().subscribe((response) => {
        this.workorder = response;
        this.filteredWorkOrder = this.workorder;
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
    this.WorkOrderService.filterdata(this.filters).subscribe((response) => {
      this.filteredWorkOrder = response;
    });
  }
  searchWorkOrder() {
    this.showLoader();
    this.filteredWorkOrder = this.commonService.filterWorkOrder(
      this.workorder,
      this.searchTerm
    );
    this.sortWorkOrder(); // Ensure the results are sorted
  }
  sortWorkOrder() {
    this.filteredWorkOrder = this.commonService.sortWorkOrder(
      this.filteredWorkOrder,
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
    this.sortWorkOrder();
  }

  deleteSelected(id?: number) {    
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this work order?',
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
        this.WorkOrderService.Deleteworkorder(idsToDelete).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The work order has been deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
          });
          this.ngOnInit();
        }, error => {
          // Handle deletion failure
          Swal.fire({
            icon: 'warning',
            title: 'Action Not Allowed',
            text: 'Work orders with "In Progress" or "Completed" status cannot be deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
        
        });
      } else {
        // User cancelled, no action taken
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The work order was not deleted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#17a2b8'
        });
      }
    });
  }
  
  history() {
    this.filteredWorkOrder = this.commonService.filterWorkOrder(
      this.workorder,
      (this.searchTerm = 'Complete')
    );
    this.sortWorkOrder();
  }
  open() {
    this.filteredWorkOrder = this.commonService.filterWorkOrder(
      this.workorder,
      (this.searchTerm = 'Open')
    );
    this.sortWorkOrder();
  }

  openModal(item?: any) {
    
    if(item.status!='Complete'){  
    if(this.employee){
      this.selectedItem = item ? { ...item } : null; 
      this.ComplationworkorderModalOpen=true;
    }
    else{
      this.selectedItem = item ? { ...item } : null; // Set the selected item for editing or null for new request   
      this.EditworkorderModalOpen = true; // Open modal by setting a flag
    }
  }
    else{
      this.EditworkorderModalOpen = false;
    }
  }
  openviewModel(item:any){
    
    this.selectedItem = item;
    this.workorderviewModalOpen=true;
  }
  onModalClose() {
    this.ngOnInit();
    this.workorderviewModalOpen=false;
    this.ComplationworkorderModalOpen=false;
  }

  review(id?: number) {
    this.selectedItem = id;
    this.ReviewworkorderModalOpen = true;
  }
  toggleAll() {
    this.workorder.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  updateSelection() {
    this.selectedItems = this.workorder.filter((item) => item.selected);
  }
}
