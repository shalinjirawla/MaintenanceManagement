import { Component, OnInit } from '@angular/core';
import { ComplaintmodelComponent } from './complaintmodel/complaintmodel.component';
import { RequestService } from '../../Service/request.service';
import { Complaint } from '../../Model/complaint.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkordermodelComponent } from '../workorder/workordermodel/workordermodel.component';
import { WorkorderreassignComponent } from '../workorder/workorderreassign/workorderreassign.component';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [
    FormsModule,
    ComplaintmodelComponent,
    CommonModule,
    WorkorderreassignComponent,
  ],
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css',
})
export class ComplaintComponent implements OnInit {
  isModalOpen = false;
  isResolved = false;
  EditworkorderModalOpen = false;
  selectedItem: any;
  complaint: Complaint[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  isadmin: boolean = false;
  selectedImage: string | null = null;
  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.showLoader();
    const id = Number(localStorage.getItem('UserId'));
    this.requestService.GetComplaint(id).subscribe((response) => {
      this.complaint = response;
    });

    const role = localStorage.getItem('Role');
    if (role == 'Admin') {
      this.isadmin = true;
    }
  }
  searchWorkOrder() {}
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
  openModal(item?: any) {
    this.selectedItem = item ? { ...item } : null;
    this.isModalOpen = true;
    this.requestService
      .updatecomplaintstatus(item.id, 1)
      .subscribe((response: boolean) => {
        console.log(response);
      });
  }
  openResolveModal(item?: any) {
    this.requestService
      .updatecomplaintstatus(item.id, 3)
      .subscribe((response: boolean) => {
        console.log(response);
        this.closeModal();
      });
  }
  openModalworkorder(item?: any) {
    this.selectedItem = item ? { ...item } : null;
    this.EditworkorderModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.ngOnInit();
  }

  openImageModal(imageSrc: string): void {
    this.selectedImage = imageSrc;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
}
