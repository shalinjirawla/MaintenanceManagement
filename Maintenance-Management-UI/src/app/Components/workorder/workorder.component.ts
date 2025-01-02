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
import { WorkordercomplationComponent } from '../workordercomplation/workordercomplation.component';
import { cleanWhitespace } from '../validation/custom-validators';

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
    WorkordercomplationComponent,
  ],
  templateUrl: './workorder.component.html',
  styleUrl: './workorder.component.css',
})
export class WorkorderComponent implements OnInit {
  selectedItem: any;
  workorder!: Workorder[];
  filteredWorkOrder!: Workorder[];
  selectedItems: Workorder[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  filters: Filter = new Filter();
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  EditworkorderModalOpen = false;
  ComplationworkorderModalOpen = false;
  ReviewworkorderModalOpen = false;
  workorderviewModalOpen = false;
  isLoading: boolean = false;
  employee: boolean = false;
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
  //Delete selected work order one or multiple
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
        const idsToDelete = id
          ? [id]
          : this.selectedItems.map((item) => item.id);
        this.WorkOrderService.Deleteworkorder(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The work order has been deleted.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745',
            }).then((result)=>{
              this.toggleAll();
              this.selectedItems=[];
              this.selectAll=false;
              this.ngOnInit();
            }); 
          },
          (error) => {
            // Handle deletion failure
            Swal.fire({
              icon: 'warning',
              title: 'Action Not Allowed',
              text: 'Work orders with "In Progress" or "Completed" status cannot be deleted.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#dc3545',
            }).then((result)=>{
              this.toggleAll();
              this.selectedItems=[];
              this.selectAll=false;
              this.ngOnInit();
            }); 
          }
        );
      } else {
        // User cancelled, no action taken
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The work order was not deleted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#17a2b8',
        }).then((result)=>{
          this.toggleAll();
          this.selectedItems=[];
          this.selectAll=false;
          this.ngOnInit();
        });      
      }
    });
  }
  //Model open for edit work order
  openModal(item?: any) {
    if (item.status != 'Complete') {
      if (this.employee) {
        this.selectedItem = item ? { ...item } : null;
        this.ComplationworkorderModalOpen = true;
      } else {
        this.selectedItem = item ? { ...item } : null; // Set the selected item for editing or null for new request
        this.EditworkorderModalOpen = true; // Open modal by setting a flag
      }
    } else {
      this.EditworkorderModalOpen = false;
    }
  }
  //Model open for View work order
  openviewModel(item: any) {
    this.selectedItem = item;
    this.workorderviewModalOpen = true;
  }
  //Model Close
  onModalClose() {
    this.ngOnInit();
    this.workorderviewModalOpen = false;
    this.ComplationworkorderModalOpen = false;
  }
  //Complated WorkOrder Details
  WorkOrderComplationReview(id?: number) {
    this.selectedItem = id;
    this.ReviewworkorderModalOpen = true;
  }
  //Search workorder
  searchWorkOrder() {
    this.showLoader();
    this.filteredWorkOrder = this.commonService.filterWorkOrder(
      this.workorder,
      this.searchTerm
    );
    this.sortWorkOrder(); // Ensure the results are sorted
  }
  //sort workorder
  sortWorkOrder() {
    this.filteredWorkOrder = this.commonService.sortWorkOrder(
      this.filteredWorkOrder,
      this.sortColumn,
      this.sortOrder
    );
  }
  //sort workorder
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortWorkOrder();
  }
  //only number
  onCostInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // This will remove non-numeric characters
  }
  //Advance Filter of work order
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));

    this.WorkOrderService.filterdata(this.filters).subscribe((response) => {
      this.filteredWorkOrder = response;
    });
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are deselected.
  toggleAll() {
    this.workorder.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  // Filters the `workorder` array to include only the items that are selected.
  updateSelection() {
    this.selectedItems = this.workorder.filter((item) => item.selected);
  }
  // Updates the `currentPage` variable when the user navigates to a different page in pagination.
  pageChanged(page: number): void {
    this.currentPage = page;
  }
  // Sets `isLoading` to true, and then resets it to false after the timeout.
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
}
