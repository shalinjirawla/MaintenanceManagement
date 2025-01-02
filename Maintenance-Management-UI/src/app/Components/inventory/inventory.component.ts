import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../Service/inventory.service';
import { CommonService } from '../../Service/common.service';
import { InventoryItem } from '../../Model/InventoryItem.model';
import { FormsModule } from '@angular/forms';
import { Filter } from '../../Model/filter.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule,NgxPaginationModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  inventory!: InventoryItem[];
  filteredinventory!: InventoryItem[];
  searchTerm: string = '';
  isLoading: boolean = false;
  filters: Filter = new Filter();
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page

  constructor(
    private inventoryService: InventoryService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.showLoader();
    const UserId = Number(localStorage.getItem('UserId'));
    this.inventoryService.getinventory(UserId).subscribe((response) => {
      this.inventory = response;
      this.filteredinventory = this.inventory;
      console.log(response);
    });
  }
  //sort inventory
  sortPeople() {
    this.filteredinventory = this.commonService.sortInventoryItem(
      this.filteredinventory,
      this.sortColumn,
      this.sortOrder
    );
  }
  //sort inventory
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortPeople();
  }
  //Advance filter inventory
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.inventoryService.filterdata(this.filters).subscribe((response) => {
      debugger;
      this.filteredinventory = response;
      console.log(this.filteredinventory);
    });
  }
  //Search inventory
  searchinventory() {
    this.showLoader();
    this.filteredinventory = this.commonService.filterInventoryItem(
      this.inventory,
      this.searchTerm
    );
    // this.sortPeople(); // Ensure the results are sorted
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
