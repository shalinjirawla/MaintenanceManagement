import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Request } from '../../../Model/request.model';
import { Workorder } from '../../../Model/workorder.model';
import { Quotation } from '../../../Model/quotation.model';
import { RequestService } from '../../../Service/request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { Notification } from '../../../Model/notification.model';
import { NotificationService } from '../../../Service/notification.service';
import Swal from 'sweetalert2';
import { Location } from '../../../Model/Location.model';
import { LocationService } from '../../../Service/location.service';

@Component({
  selector: 'app-requsttrackingquotationmodel',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './requsttrackingquotationmodel.component.html',
  styleUrl: './requsttrackingquotationmodel.component.css'
})
export class RequsttrackingquotationmodelComponent {
  @Input() item: any; // Input to receive the selected item for editing
  @Output() close = new EventEmitter<void>();
  
  isEditing = false;
  workorder: Workorder = new Workorder();
  quotation:Quotation=new Quotation();
  QuotationModalOpen = false;
  declineModalOpen = false;
  declineReason: string = '';
  location!: Location[];

  constructor(private requestService:RequestService,
    private notificationService:NotificationService,
    private locationService: LocationService
  ){}
  ngOnInit() {    
    this.QuotationModalOpen=true;
    if (this.item) {
      
      this.workorder = { ...this.item.workRequest }; // Populate with selected item data for editing      
      this.quotation.email = this.item.createdByUser?.email ?? ''; // Use an empty string if email is undefined
      this.isEditing = true; // Set editing mode if an item is provided
    
    } else {
      // Set a default value for submittedBy if creating a new request
      this.workorder.createdBy; 
    }    
    const id = Number(localStorage.getItem('UserId'));
    this.locationService.Getlocation(id).subscribe((response) => {
      this.location = response;
    });
  }

  onCostNumberInput(event: any) {
    // Remove non-numeric characters
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  closeModal() {    
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }

  sendQuotation(id:number,reqid:number) {  
//  const senderEmail = localStorage.getItem('UserEmail');// Retrieve sender's email from local storage
    const senderEmail='xmxemp@gmail.com'
    const recipientEmail = this.quotation.email; // Recipient's email from the form
    const estimatedCost = this.quotation.estimatedCost; // From the form
    const estimatedTime = this.quotation.time; // From the form
    const requestid=id;
    const emailPayload = {
        sender: senderEmail,
        recipient: recipientEmail,
        subject: 'Quotation Request',
        body: `Estimated Cost: ${estimatedCost}\nEstimated Time: ${estimatedTime}`,
        requestid:requestid,
    };

    this.requestService.sendEmail(emailPayload).subscribe(response=>{
      
      this.closeModal();
      const data=new Notification();
      data.id=0;
      data.message='A new quotation has been sent for your Request.';
      data.isRead=false;
      data.senderID=Number(localStorage.getItem("UserId"));
      data.reciverId=reqid;
      this.notificationService.SendMessage(data).subscribe(response=>{
        console.log(response);
      });
      Swal.fire({
        icon: 'success',
        title: 'Service Estimate Sent Successfully',
        text: 'The Service Estimate has been sent successfully. You will be notified once it is reviewed.',
        confirmButtonColor: '#3085d6',
      });
    });
  }
}
