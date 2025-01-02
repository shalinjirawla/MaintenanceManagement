import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../Service/common.service';
import { UserService } from '../../Service/user.service';
import { Login } from '../../Model/login.model';
import { PeoplemodelComponent } from './peoplemodel/peoplemodel.component';
import { Filter } from '../../Model/filter.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { PeopleviewmodelComponent } from './peopleviewmodel/peopleviewmodel.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PeoplemodelComponent,
    NgxPaginationModule,
    PeopleviewmodelComponent,
  ],
  templateUrl: './people.component.html',
  styleUrl: './people.component.css',
})
export class PeopleComponent {
  employee!: Login[];
  selectAll: boolean = false;
  selectedItems: Login[] = [];
  selectedItem: Login | null = null;
  isModalOpen = false;
  isviewModalOpen = false;
  filters: Filter = new Filter();
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  isLoading: boolean = false;
  searchTerm: string = '';
  filteredpeople!: Login[];
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc'; // Ascending by default

  constructor(
    private userService: UserService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    debugger;
    this.showLoader();
    const userId = Number(localStorage.getItem('UserId'));
    this.userService.getEmployeesAll(userId).subscribe((response) => {
      this.employee = response;
      this.filteredpeople = this.employee;
    });
  }

  //Delete people
  deletepeople(id?: number) {
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0d6efd',
    }).then((result) => {
      if (result.isConfirmed) {
        const idsToDelete = id
          ? [id]
          : this.selectedItems.map((item) => item.userID);
        this.userService.deleteEmployees(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `${response} user(s) deleted successfully.`,
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
            const errorMessage =
              error.status === 409
                ? 'Some users could not be deleted due to currently working.'
                : 'User cannot be deleted.';
            Swal.fire({
              icon: 'warning',
              title: 'Action Not Allowed',
              text: errorMessage,
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
          text: 'The user was not deleted.',
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
  //Update Peoople
  updatepeople(id: number) {
    const selectedEmployee = this.employee.find((item) => item.userID === id);
    if (selectedEmployee) {
      this.selectedItem = selectedEmployee;
    }
    this.isModalOpen = true;
  }
  //View Model Open
  Viewpeople(item: Login) {
    this.selectedItem = item;
    this.isviewModalOpen = true;
  }
  //Model Open
  openModal() {
    this.isModalOpen = true;
  }
  //Model Close
  closeModal() {
    this.isModalOpen = false;
    this.isviewModalOpen = false;
    this.selectedItem = null;
    this.ngOnInit();
  }
  //Search people
  searchpeople() {
    this.showLoader();
    this.filteredpeople = this.commonService.filterPeople(
      this.employee,
      this.searchTerm
    );
    this.sortPeople(); // Ensure the results are sorted
  }
  //sort people
  sortPeople() {
    this.filteredpeople = this.commonService.sortPeople(
      this.filteredpeople,
      this.sortColumn,
      this.sortOrder
    );
  }
  //sort people
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.sortPeople();
  }
  //Advance Filter of people
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.userService.filterdata(this.filters).subscribe((response) => {
      this.filteredpeople = response;
    });
  }
  // If `selectAll` is true, all items are selected; otherwise, all items are deselected.
  toggleAll() {
    this.employee.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  // Filters the `people` array to include only the items that are selected.
  updateSelection() {
    this.selectedItems = this.employee.filter((item) => item.selected);
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
