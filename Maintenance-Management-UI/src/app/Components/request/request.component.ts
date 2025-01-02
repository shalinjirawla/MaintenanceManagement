import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RequestmodelComponent } from './requestmodel/requestmodel.component';
import { RequestService } from '../../Service/request.service';
import { response } from 'express';
import { Request } from '../../Model/request.model';
import { WorkRequestWithStatusDto } from '../../Model/WorkRequestWithStatusDto';
import { CommonService } from '../../Service/common.service';
import { Filter } from '../../Model/filter.model';
import { FeedbackmodelComponent } from '../feedback/feedbackmodel/feedbackmodel.component';
import { NotificationService } from '../../Service/notification.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RequestmodelComponent,
    FeedbackmodelComponent,
    NgxPaginationModule,
  ],
  templateUrl: './request.component.html',
  styleUrl: './request.component.css',
})
export class RequestComponent implements OnInit {
  selectedItem: any;
  isModalOpen = false;
  isQuotationModal = false;
  requests!: Request[];
  WorkRequest!: WorkRequestWithStatusDto[];
  selectAll: boolean = false;
  selectedItems: WorkRequestWithStatusDto[] = [];
  searchTerm: string = '';
  filteredWorkRequests!: WorkRequestWithStatusDto[];
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  filters: Filter = new Filter();
  feedbackModalOpen = false;
  isLoading: boolean = false;
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 8; // Items per page

  constructor(
    private requestService: RequestService,
    private commonService: CommonService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.showLoader();
    const userId =
      typeof localStorage !== 'undefined'
        ? Number(localStorage.getItem('UserId'))
        : null;
    if (userId) {
      this.requestService.GetByIdRequest(userId).subscribe((response) => {
        this.WorkRequest = response;
        this.filteredWorkRequests = this.WorkRequest;
      });
      const message = 'A new quotation has been sent for your Request.';
      this.notificationService
        .markasAllread(userId, message)
        .subscribe((response) => {});
    }
  }


  clearSelection() {
    this.WorkRequest.forEach((item) => (item.workRequest.selected = false));
    this.selectedItems = []; // Clear the selectedItems array
  }

  deleteSelected() {}

  openModal() {
    this.isModalOpen = true; // Open modal by setting a flag
    this.isQuotationModal = false;
  }
  openFeedbackModal(item: any) {
    this.selectedItem = item;
    this.feedbackModalOpen = true;
  }

  openModalquotation(body: string, id: number) {
    this.selectedItem = this.WorkRequest.find(
      (item) => item.body == body && item.workRequest.id == id
    ); // Find the work request by id
    this.isQuotationModal = true; // Set to open the quotation modal
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false; // Close modal
    this.selectedItem = null; // Reset selected item
    this.feedbackModalOpen = false;
  }
  onModalClose() {
    this.isModalOpen = false; // Close the modal
    this.selectedItem = null; // Clear the selected item

    // Fetch updated list of work requests to refresh the table
    const userId = Number(localStorage.getItem('UserId'));
    this.requestService.GetByIdRequest(userId).subscribe((response) => {
      this.WorkRequest = response;
      this.filteredWorkRequests = this.WorkRequest; // Update filtered requests
    });
  }
  //Search Request
  searchRequests() {
    this.showLoader();
    this.filteredWorkRequests = this.commonService.filterWorkRequest(
      this.WorkRequest,
      this.searchTerm
    );
    this.sortRequests(); // Ensure the results are sorted
  }
  //sort Request
  sortRequests() {
    this.filteredWorkRequests = this.commonService.sortWorkRequest(
      this.filteredWorkRequests,
      this.sortColumn,
      this.sortOrder
    );
  }
  //sort Request
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortRequests();
  }
  //Advance Filter of Request
  applyFilters(): void {
    this.showLoader();
    this.filters.createdBy = Number(localStorage.getItem('UserId'));
    this.requestService.filterdata(this.filters).subscribe((response) => {
      this.filteredWorkRequests = response;
      console.log(response);
    });
  }
  // Filters the `request` array to include only the items that are selected.
  updateSelection() {
    this.selectedItems = this.WorkRequest.filter(
      (item) => item.workRequest.selected
    );
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are deselected.
  toggleAll() {
    this.WorkRequest.forEach(
      (item) => (item.workRequest.selected = this.selectAll)
    );
    this.updateSelection();
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
