import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkRequestWithStatusDto } from '../../../Model/WorkRequestWithStatusDto';
import { RequestService } from '../../../Service/request.service';
import { Complaint } from '../../../Model/complaint.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complaintmodel',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './complaintmodel.component.html',
  styleUrl: './complaintmodel.component.css'
})
export class ComplaintmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  errorMessage: string = '';
  complaintForm!: FormGroup;
  WorkRequest!: WorkRequestWithStatusDto[];
  isadmin:boolean=false;
  complaint!:Complaint;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder,private requestService: RequestService){
    this.complaintForm = this.fb.group({
      id:[0],
      customerID:[''],
      WorkRequestID:[''],
      title:['', [Validators.required]],
      description:['', [Validators.required]],
      priority:[],
      attachment:[],
      status:[''], 
    });
  }
  ngOnInit(): void {
    
    if(this.item){
      this.complaint=this.item;
    }
    const id=Number(localStorage.getItem("UserId"));    
    this.requestService.GetByIdRequest(id).subscribe(response=>{
      this.WorkRequest=response;
    });
    const role= localStorage.getItem("Role");
    if(role=='Admin'){
      this.isadmin=true;
    }

  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;  // Keep track of the file
      // No need to use patchValue for the file input
      console.log('Selected file:', file);
    }
  }

  onSubmitComplaint() {
    
    if(this.complaintForm.valid){
      const formData = new FormData();
      formData.append('complaintDto.Id', '0');  // Default ID or set according to your requirements
      formData.append('complaintDto.CustomerID',  localStorage.getItem("UserId") || '');
      formData.append('complaintDto.WorkRequestID', this.complaintForm.get('WorkRequestID')?.value);
      formData.append('complaintDto.Title', this.complaintForm.get('title')?.value);
      formData.append('complaintDto.Description', this.complaintForm.get('description')?.value);
      formData.append('complaintDto.Priority', this.complaintForm.get('priority')?.value);
      formData.append('complaintDto.Status', '0'); // Initial status

      if (this.selectedFile) {
        formData.append('images', this.selectedFile);
      }      
        this.requestService.addcomplaint(formData).subscribe(response=>{
          Swal.fire({
            icon: 'success',
            title:'Sent Successfully',
            text:'Complaint Sent Successfully',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closeModal(); 
          });        
      });
    }
    else{
      this.complaintForm.markAllAsTouched();
    }
  }

  closeModal() {
    
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }
}
