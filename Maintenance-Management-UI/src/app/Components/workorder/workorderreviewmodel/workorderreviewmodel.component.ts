import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkOrderCompletion } from '../../../Model/workOrderCompletion .model';
import { WorkOrderService } from '../../../Service/workorder.service';
import { response } from 'express';

@Component({
  selector: 'app-workorderreviewmodel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workorderreviewmodel.component.html',
  styleUrl: './workorderreviewmodel.component.css',
})
export class WorkorderreviewmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  ReviewworkorderModalOpen = false;
  workorderreview!: WorkOrderCompletion;

  constructor(private WorkOrderService: WorkOrderService) {}
  ngOnInit(): void {
    this.loadreviewdata();
  }

  loadreviewdata() {
    if (this.item) {
      this.WorkOrderService.Getreviewworkorder(this.item).subscribe((response) => {
        this.workorderreview = response;
      });
    }
  }
  closeModal() {
    
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }
}
