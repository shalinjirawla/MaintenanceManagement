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
  selectedItem!: Login;
  isModalOpen = false;
  isviewModalOpen = false;
  filters: Filter = new Filter();
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  isLoading: boolean = false;
  searchTerm: string = '';
  filteredpeople!: Login[];

  constructor(
    private userService: UserService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.showLoader();
    const userId = Number(localStorage.getItem('UserId'));
    this.userService.getEmployeesAll(userId).subscribe((response) => {
      this.employee = response;
      this.filteredpeople = this.employee;
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



  updateSelection() {
    this.selectedItems = this.employee.filter((item) => item.selected);
  }
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
        const idsToDelete = id ? [id] : this.selectedItems.map((item) => item.userID);    
        this.userService.deleteEmployees(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `${response} user(s) deleted successfully.`,
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745',
            });
            this.ngOnInit();          
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
          confirmButtonColor: '#17a2b8'
        });
      }
    });
  }
  updatepeople(id: number) {
    const selectedEmployee = this.employee.find((item) => item.userID === id);
    if (selectedEmployee) {
      this.selectedItem = selectedEmployee;
    }
    this.isModalOpen = true;
  }
  Viewpeople(item: Login) {
    this.selectedItem = item;
    this.isviewModalOpen = true;
  }
  applyFilters(): void {
    this.showLoader();
    this.filters.id = Number(localStorage.getItem('UserId'));
    this.userService.filterdata(this.filters).subscribe((response) => {
      this.filteredpeople = response;
    });
  }
  searchpeople() {
    this.showLoader();
    this.filteredpeople = this.commonService.filterPeople(
      this.employee,
      this.searchTerm
    );
    //this.sortasset(); // Ensure the results are sorted
  }

  toggleAll() {
    this.employee.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  clearSelection() {
    this.employee.forEach((item) => (item.selected = false));
    this.selectedItems = []; // Clear the selectedItems array
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isviewModalOpen = false;
    this.ngOnInit();
  }
}
