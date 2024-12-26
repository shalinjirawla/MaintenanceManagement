import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Workorder } from '../../../Model/workorder.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../../Model/login.model';
import { UserService } from '../../../Service/user.service';
import { WorkOrderService } from '../../../Service/workorder.service';
import { response } from 'express';
import { RequestService } from '../../../Service/request.service';
import Swal from 'sweetalert2';
import { Asset } from '../../../Model/asset.model';
import { Location } from '../../../Model/Location.model';
import { LocationService } from '../../../Service/location.service';
import { AssetsService } from '../../../Service/assets.service';

@Component({
  selector: 'app-workorderreassign',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './workorderreassign.component.html',
  styleUrl: './workorderreassign.component.css'
})
export class WorkorderreassignComponent implements OnInit{
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  workorder!:Workorder;
  workorderForm!: FormGroup;
  availableEmployees: Login[] = [];
  previousemp!:number;
  location!: Location[];
  assets: Asset[] = [];
  
  constructor(private userService:UserService,
    private fb: FormBuilder,
    private WorkOrderService: WorkOrderService,
    private locationService: LocationService,
    private assetsService: AssetsService,
    private requestService: RequestService){
    this.workorderForm = this.fb.group({
      id:[0],
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      category: ['', Validators.required],
      location: [null, Validators.required],
      asset: [null],
      comment:['',Validators.required],
      assignedTo:[''],
      additionalWorkers:[''],
      status:[''],
      requestedId:[]

    });
  }
  
  ngOnInit(): void {
    if (this.item) {    
      this.workorder = { ...this.item}; // Populate with selected item data for editing
      this.workorderForm.patchValue({
        title: this.workorder.title,
        description: this.workorder.description,
        priority: this.workorder.priority,
        location:this.workorder.location,
        asset:this.workorder.asset,
        category:this.workorder.category
      });
      this.WorkOrderService.GetPreviousassignemployee(this.item.workRequestID).subscribe(response=>{
        
        this.previousemp=response;
        this.workorderForm.patchValue({
          assignedTo: this.previousemp
        });
      });
      //this.item.assignedTo=this.workorder.assignedToUser?.username;    
    }  
    const id = Number(localStorage.getItem('UserId'));    
    this.locationService.Getlocation(id).subscribe((response) => {
      this.location = response;
    });
    this.assetsService.GetAssets(id).subscribe((response) => {
      this.assets = response;
    }); 
  }

  loadEmployees(start:string,end:string) {    
    const hadId=Number(localStorage.getItem("UserId"));
    this.userService.getEmployees(start,end,hadId).subscribe(employees => {
        this.availableEmployees = employees;
        console.log(this.availableEmployees);
    });
  }

  Checkawailable() { 
    const start = this.workorderForm.get('startDate')?.value;
    const end = this.workorderForm.get('dueDate')?.value;
    if (start && end) {
      this.loadEmployees(start,end);
    }
  }

  onSubmit(id:number){
    
    if(this.workorderForm.valid){
      const formData=this.workorderForm.value;
      formData.additionalWorkers='team';
      formData.status='Open';  
      formData.requestedId=Number(localStorage.getItem("UserId"));  
      console.log(formData);
      this.WorkOrderService.createWorkOrder(formData).subscribe(response=>{            
        this.requestService.updatecomplaintstatus(id,2).subscribe((response:boolean)=>{
          Swal.fire({
            icon: 'success',
            title: 'Reassigned Successfully',
            text: 'Work Order reassigned to the employee successfully.',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closeModal(); 
          });          
             
        });        
      });
    }
    else{
      this.workorderForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit(); // Emit close event
    this.item = null; // Reset item
  }
}
