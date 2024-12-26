import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RequestService } from '../../../Service/request.service';
import { WorkRequestWithStatusDto } from '../../../Model/WorkRequestWithStatusDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedbackmodel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedbackmodel.component.html',
  styleUrl: './feedbackmodel.component.css',
})
export class FeedbackmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  errorMessage: string = '';
  feedbackForm!: FormGroup;
  WorkRequest!: WorkRequestWithStatusDto[];
  isadmin: boolean = false;

  constructor(private fb: FormBuilder, private requestService: RequestService) {
    this.feedbackForm = this.fb.group({
      id: [0],
      customerID: [''],
      WorkRequestID: [''],
      satisfied: [''],
      inFuture: [],
      resolutionNotes: [],
      resolvedStatus: [],
      comments: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    
    const id = Number(localStorage.getItem('UserId'));

    if (this.item) {
    }
  }
  onSubmit() {
    
    if (this.feedbackForm.valid) {
      const formData = this.feedbackForm.value;
      formData.customerID = this.item.workRequest.createdBy;
      formData.WorkRequestID = this.item.workRequest.id;
      formData.resolvedStatus = 0;
      this.requestService.completeworkorder(formData).subscribe((response) => {
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Thank you for your feedback!',
          text: 'It helps us improve our service.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745' 
        });
      });
    } else {
      this.errorMessage = 'please fill require fields.';
    }
  }
  closeModal() {
    
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }
}
