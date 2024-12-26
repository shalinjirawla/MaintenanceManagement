import { Component } from '@angular/core';
import { RequestService } from '../../Service/request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestmodelComponent } from '../request/requestmodel/requestmodel.component';
import { Request } from '../../Model/request.model';
import { Login } from '../../Model/login.model';
import { WorkRequestWithStatusDto } from '../../Model/WorkRequestWithStatusDto';
import { RequesttrackingmodelComponent } from './requesttrackingmodel/requesttrackingmodel.component';
import { RequsttrackingquotationmodelComponent } from './requsttrackingquotationmodel/requsttrackingquotationmodel.component';
import { CommonService } from '../../Service/common.service';
import { Filter } from '../../Model/filter.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationService } from '../../Service/notification.service';
import Swal from 'sweetalert2';
import { RequestdeclinemodelComponent } from './requestdeclinemodel/requestdeclinemodel.component';

@Component({
  selector: 'app-requesttracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RequesttrackingmodelComponent,
    RequsttrackingquotationmodelComponent,
    RequestdeclinemodelComponent,
    NgxPaginationModule,
  ],
  templateUrl: './requesttracking.component.html',
  styleUrl: './requesttracking.component.css',
})
export class RequesttrackingComponent {
  selectedItem: any;
  requests!: Request[];
  WorkRequest!: WorkRequestWithStatusDto[];
  selectAll: boolean = false;
  selectedItems: WorkRequestWithStatusDto[] = [];
  WorkorderModalOpen = false;
  QuotationModalOpen = false;
  searchTerm: string = '';
  filteredWorkRequests!: WorkRequestWithStatusDto[];
  // Sorting variables
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  filters: Filter = new Filter();
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 8; // Items per page
  isLoading: boolean = false;
  selectedImage: string | null = null;
  declineModalOpen=false;

  constructor(
    private requestService: RequestService,
    private commonService: CommonService,
    private notificationService: NotificationService
  ) {}
  ngOnInit() {
    this.showLoader();
    const Role = localStorage.getItem('Role');
    if (Role == 'Admin') {
      const userId = Number(localStorage.getItem('UserId'));
      this.requestService.GetByRoleIdRequest(userId).subscribe((response) => {
        this.WorkRequest = response;
        this.filteredWorkRequests = this.WorkRequest;
      });
    } else {
      this.requestService.GetAllRequests().subscribe((response) => {
        this.WorkRequest = response;
        this.filteredWorkRequests = this.WorkRequest;
      });
    }
    const id = Number(localStorage.getItem('UserId'));
    const message = 'New Work Request Added,Customer has accepted quotation';
    this.notificationService
      .markasAllread(id, message)
      .subscribe((response) => {});
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

  updateSelection() {
    this.selectedItems = this.WorkRequest.filter(
      (item) => item.workRequest.selected
    );
  }

  toggleAll() {
    this.WorkRequest.forEach(
      (item) => (item.workRequest.selected = this.selectAll)
    );
    this.updateSelection();
  }
  searchRequests() {
    this.showLoader();
    this.filteredWorkRequests = this.commonService.filterWorkRequest(
      this.WorkRequest,
      this.searchTerm
    );
    this.sortRequests(); // Ensure the results are sorted
  }

  sortRequests() {
    this.filteredWorkRequests = this.commonService.sortWorkRequest(
      this.filteredWorkRequests,
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
    this.sortRequests();
  }
  applyFilters(): void {
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.requestService.filterdata(this.filters).subscribe((response) => {
      this.filteredWorkRequests = response;
      console.log(response);
    });
  }

  clearSelection() {
    this.WorkRequest.forEach((item) => (item.workRequest.selected = false));
    this.selectedItems = []; // Clear the selectedItems array
  }

  deleteSelected() {
    
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
        // User confirmed, proceed with deletion
        const idsToDelete = this.selectedItems.map((item) => item.workRequest.id);       
       // const idsToDelete = this.selectedItems.map((item) => item.id);
       this.requestService.deleterequest(idsToDelete).subscribe(response => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The Request has been deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
          });
          this.ngOnInit();
        }, error => {
          // Handle deletion failure
          Swal.fire({
            icon: 'warning',
            title: 'Action Not Allowed',
            text: 'Request cannot be deleted.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
        
        });
      } else {
        // User cancelled, no action taken
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'The Request was not deleted.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#17a2b8'
        });
      }
    });        
  }

  openModal(item?: any) {
    
    this.selectedItem = item ? { ...item } : null; // Set the selected item for editing or null for new request
    // Here, you can open the modal
    if (item.status === 2) {
      this.WorkorderModalOpen = true;
    } else if (item.status === null) {
      this.QuotationModalOpen = true; // Open modal by setting a flag
    }
  }
  openDeclineModal(item?: any) {
    
    this.selectedItem = item ? { ...item } : null;
    this.declineModalOpen=true;
  }
  closeModal() {
    this.selectedItem = null; // Reset selected item
  }
  openImageModal(imageSrc: string): void {
    this.selectedImage = imageSrc;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }

  onModalClose() {
    this.declineModalOpen=false;
    this.ngOnInit();
  }
}
