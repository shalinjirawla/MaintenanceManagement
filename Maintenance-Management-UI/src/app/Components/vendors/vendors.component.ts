import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VendormodelComponent } from './vendormodel/vendormodel.component';
import { VendorService } from '../../Service/vendor.service';
import { response } from 'express';
import { Vendor } from '../../Model/vendor.model';
import Swal from 'sweetalert2';
import { format } from 'path';
import { FormsModule } from '@angular/forms';
import { VendorviewmodelComponent } from './vendorviewmodel/vendorviewmodel.component';
import { CommonService } from '../../Service/common.service';
import { Filter } from '../../Model/filter.model';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [VendormodelComponent, CommonModule, FormsModule,VendorviewmodelComponent],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css',
})
export class VendorsComponent implements OnInit {
  isModalOpen = false;
  isViewModalOpen = false;
  vendor!: Vendor[];
  filteredvendor!:Vendor[];
  selectedItems: Vendor[] = [];
  selectedItem: Vendor | null = null;
  selectAll: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;
  filters: Filter = new Filter();

  constructor(private vendorService: VendorService,private commonService: CommonService) {}

  ngOnInit(): void {
    this.showLoader();
    const Id = Number(localStorage.getItem('UserId'));
    this.vendorService.getvendor(Id).subscribe((response) => {
      this.vendor = response;
      this.filteredvendor=this.vendor;
    });
  }

  Deletevendor(id?: number) {    
    Swal.fire({
      title: 'Confirm Deletion?',
      text: 'Are you sure you want to delete this Vendor?',
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
        this.vendorService.Deletevendor(idsToDelete).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The vendor has been deleted.',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745',
            });
            this.ngOnInit();
            this.selectedItems.length=0;
          },
          (error) => {
            // Handle deletion failure
            Swal.fire({
              icon: 'warning',
              title: 'Action Not Allowed',
              text: 'vendor can not deleted.',
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
    this.vendorService.filterdata(this.filters).subscribe((response) => {
      this.filteredvendor = response;
    });
  }
  Viewvendor(item:Vendor){
    
    this.isViewModalOpen = true;
    this.selectedItem = item || null; 
  }

  OpenModal(item: Vendor | null = null) {
    
    this.isModalOpen = true;
    this.selectedItem = item || null;    
  }
  closeModal() {
    this.ngOnInit();
    this.isModalOpen = false;
    this.isViewModalOpen = false;
  }
  toggleAll() {
    this.vendor.forEach((item) => (item.selected = this.selectAll));
    this.updateSelection();
  }
  updateSelection() {
    this.selectedItems = this.vendor.filter((item) => item.selected);
  }
  searchlocation() {
    this.showLoader();
    this.filteredvendor = this.commonService.filterVendor(
      this.vendor,
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
