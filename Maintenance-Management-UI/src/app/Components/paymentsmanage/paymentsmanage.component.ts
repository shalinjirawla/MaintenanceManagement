import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../Service/payment.service';
import { Payemnt } from '../../Model/payment.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from '../../Service/common.service';
import { Filter } from '../../Model/filter.model';

@Component({
  selector: 'app-paymentsmanage',
  standalone: true,
  imports: [CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './paymentsmanage.component.html',
  styleUrl: './paymentsmanage.component.css'
})
export class PaymentsmanageComponent {
  isLoading: boolean = false;
  payment!:Payemnt[];
  filteredpayment!:Payemnt[];
  hover = false;  
  copied = false;
  filters: Filter = new Filter();
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 1; // Items per page
  searchTerm: string = '';
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  constructor(private paymentService:PaymentService,private commonService: CommonService){}

  ngOnInit() {
    this.showLoader();
    const userId = Number(localStorage.getItem('UserId'));
    this.paymentService.getPayment(userId).subscribe((response) => {
      this.payment = response;
      this.filteredpayment = this.payment;
    });
  }
  //paymentId copy in clipboard
  copyToClipboard(paymentId: string): void {
    // Create a temporary input element to copy the paymentId
    const tempInput = document.createElement('input');
    tempInput.value = paymentId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');  // Copy the value to the clipboard
    document.body.removeChild(tempInput);

    // Change the tooltip text to "Copied"
    this.copied = true;

    // Reset the copied status after 2 seconds
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }
  //sort payment
   sortWorkOrder() {
    this.filteredpayment = this.commonService.sortPayment(
      this.filteredpayment,
      this.sortColumn,
      this.sortOrder
    );
  }
  //sort payment
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortWorkOrder();
  }
  //search payment
  searchpayment() {
    this.showLoader();
    this.filteredpayment = this.commonService.filterPayment(
      this.payment,
      this.searchTerm
    );
  }
  //Advance Filter of payment
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.paymentService.filterdata(this.filters).subscribe((response) => {
      this.filteredpayment = response;
    });
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
