import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Request } from '../../../Model/request.model';
import { RequestService } from '../../../Service/request.service';
import { Workorder } from '../../../Model/workorder.model';
import { Quotation } from '../../../Model/quotation.model';
import { WorkRequestWithStatusDto } from '../../../Model/WorkRequestWithStatusDto';
import { NotificationService } from '../../../Service/notification.service';
import { Notification } from '../../../Model/notification.model';
import Swal from 'sweetalert2';
import { Location } from '../../../Model/Location.model';
import { LocationService } from '../../../Service/location.service';
import { noWhitespaceValidator } from '../../validation/custom-validators';

@Component({
  selector: 'app-requestmodel',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './requestmodel.component.html',
  styleUrl: './requestmodel.component.css'
})
export class RequestmodelComponent implements OnInit {
  @Input() item: any; // Input to receive the selected item for editing
  @Input() isQuotation: boolean = false;
  @Output() close = new EventEmitter<void>();
  requestForm!: FormGroup;
  isModalOpen = false; // Control modal visibility
  isEditing = false;
  newRequest: Request = new Request();
  workorder: Workorder = new Workorder();
  quotation:Quotation=new Quotation();
  WorkRequest!:WorkRequestWithStatusDto[];
  selectedFile: File | null = null;
  errorMessage: string = ''; 
  showQuotationModal = false;
  requestid!:number;
  filteredWorkRequests!: WorkRequestWithStatusDto[];
  location!: Location[];
  isSubmitting = false; 

  constructor(private fb: FormBuilder,
    private requestService:RequestService,
    private notificationService:NotificationService,
    private locationService: LocationService){      
    }
  ngOnInit() {    
     // Initialize the reactive form
     this.requestForm = this.fb.group({
      title: ['', [Validators.required, noWhitespaceValidator]],
      description: ['', [Validators.required, Validators.minLength(10),noWhitespaceValidator]],
      location: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      image: ['']
    });

    if (this.item) {
      this.workorder = { ...this.item.workRequest }; // Populate work order with selected item data for editing
      if (this.isQuotation) {
        this.quotation = { ...this.item.workRequest }; // Populate with workRequest data if in quotation mode
        this.requestid=this.item.workRequest.id;
        const bodyString = this.item.body;

        // Use regular expressions or split methods to extract cost and time
        const estimatedCostMatch = bodyString.match(/Estimated Cost:\s?(\d+)/); // Capture the cost
        const estimatedTimeMatch = bodyString.match(/Estimated Time:\s?(\d+\s?(?:hr|days))/); 
  
        // Assign the extracted values to the quotation object
        if (estimatedCostMatch) {
          this.quotation.estimatedCost = estimatedCostMatch[1]; // Assign cost
        }
  
        if (estimatedTimeMatch) {
          this.quotation.time = estimatedTimeMatch[1]; // Assign time
        }
      }
      this.isEditing = true;
    }
    this.workorder.priority='';
    this.workorder.location=0;
    const id = Number(localStorage.getItem('HadAdminId'));
    this.locationService.Getlocation(id).subscribe((response) => {
      this.location = response;
    });
  }

  onSubmit() {
    debugger;    
    if (this.requestForm.valid && !this.isQuotation && !this.isSubmitting) { 
      this.isSubmitting = true;     
      const formData = new FormData();
      this.workorder.createdBy=Number(localStorage.getItem("UserId"));
      this.newRequest.hadAdminId=Number(localStorage.getItem("HadAdminId"));      
      formData.append('Id', '0');  // Match property names (case-sensitive)
      formData.append('Title',this.requestForm.value.title);
      formData.append('Description', this.requestForm.value.description);
      formData.append('Priority', this.requestForm.value.priority);
      formData.append('Image', this.workorder.image);
      formData.append('CreatedBy', this.workorder.createdBy.toString());
      formData.append('Status', 'Pending');
      formData.append('Location',this.requestForm.value.location.toString());
      formData.append('HadAdminId', this.newRequest.hadAdminId.toString());

      if (this.selectedFile) {
        formData.append('images', this.selectedFile);
      }

    this.requestService.createRequest(formData).subscribe({
      next: (response) => {
        const data=new Notification();
        data.id=0;
        data.message='New Work Request Added';
        data.isRead=false;
        data.senderID=Number(localStorage.getItem("UserId"));
        data.reciverId=Number(localStorage.getItem("HadAdminId"))
        this.notificationService.SendMessage(data).subscribe(response=>{
          console.log(response);
        });
        Swal.fire({
          icon: 'success',
          title: 'Request Add Successfully',
          text: 'Add Successfully',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          // Close the modal after the user clicks "OK"
          this.isSubmitting = false; 
          this.closeModal();
        });
             
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while creating the request.';
      }
    });
  }
  }
  
  acceptQuotation(id:number){  
 // console.log(id);
    this.requestService.UpdateQuotationstatus(id).subscribe(response=>{
      const data=new Notification();
      data.id=0;
      data.message=`Customer has accepted quotation #${id}.`
      data.isRead=false;
      data.senderID=Number(localStorage.getItem("UserId"));
      data.reciverId=Number(localStorage.getItem("HadAdminId"))
      this.notificationService.SendMessage(data).subscribe(response=>{
        console.log(response);
      });
      this.closeModal(); 
    });
  }
  onFileSelected(event: any) {
    debugger;
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.workorder.image = file.name;
      console.log('Selected file:', file);
    }
  }


  closeModal() {
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }

}
