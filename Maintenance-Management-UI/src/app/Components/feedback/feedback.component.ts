import { Component, OnInit } from '@angular/core';
import { FeedbackmodelComponent } from './feedbackmodel/feedbackmodel.component';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../Service/request.service';
import { CustomerFeedback } from '../../Model/customerFeedback.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FeedbackmodelComponent, CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent implements OnInit {
  isModalOpen = false;
  feedback!: CustomerFeedback[];
  selectedItem: any;
  searchTerm: string = '';
  isadmin: boolean = false;
  isLoading: boolean = false;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.showLoader();
    const id = Number(localStorage.getItem('UserId'));
    this.requestService.Getfeedback(id).subscribe((response) => {
      this.feedback = response;
      console.log(this.feedback);
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
  }
  closeModal() {
    this.isModalOpen = false;
  }
}
