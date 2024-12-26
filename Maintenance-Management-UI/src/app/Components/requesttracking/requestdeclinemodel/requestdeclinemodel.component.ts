import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestService } from '../../../Service/request.service';
import { FormsModule } from '@angular/forms';
import { Notification } from '../../../Model/notification.model';
import { NotificationService } from '../../../Service/notification.service';
import { Workorder } from '../../../Model/workorder.model';

@Component({
  selector: 'app-requestdeclinemodel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requestdeclinemodel.component.html',
  styleUrl: './requestdeclinemodel.component.css',
})
export class RequestdeclinemodelComponent implements OnInit{
  @Input() item: any; // Input to receive the selected item for editing
  @Output() close = new EventEmitter<void>();

  declineModalOpen = false;
  declineReason: string = '';
  workorder: Workorder = new Workorder();

  constructor(
    private requestService: RequestService,
    private notificationService: NotificationService
  ) {
   
  }
  ngOnInit(): void {
    
    if (this.item) {
      
      this.workorder = { ...this.item.workRequest };
      this.declineModalOpen=true;
    }
  }

  confirmDecline(id: number, declineReason: string) {
    this.requestService
      .requestdecline(id, declineReason)
      .subscribe((response) => {
        this.declineModalOpen = false; // Close the confirmation modal
        const data = new Notification();
        data.id = 0;
        data.message = `We regret to inform you that your request for ${declineReason} has been declined. If you have any questions or would like to discuss this further, please feel free to contact us..`;
        data.isRead = false;
        data.senderID = Number(localStorage.getItem('UserId'));
        data.reciverId = this.workorder.createdBy;
        this.notificationService.SendMessage(data).subscribe((response) => {
          console.log(response);
        });
        this.onModalClose();
      });
  }
  onModalClose() {
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
    this.declineReason = '';  
    this.declineModalOpen = false;
  }
}
