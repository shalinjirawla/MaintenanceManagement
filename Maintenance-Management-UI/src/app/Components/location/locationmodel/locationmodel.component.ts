import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../../Service/location.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-locationmodel',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './locationmodel.component.html',
  styleUrl: './locationmodel.component.css'
})
export class LocationmodelComponent {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();
  isModalOpen = false;
  locationForm!: FormGroup; 
  isedit:boolean=false;

  constructor(private fb: FormBuilder,
    private locationService:LocationService
  ){
    this.locationForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [],
      hadAdmin:[],
    });
  }

  ngOnInit(): void {
  if(this.item){
    
    this.isedit=true;
    // Ensure the status is either true (1) or false (0)
    const status = this.item.status === 1; // true if 1, false if 0
    this.locationForm.patchValue({
      ...this.item,
      status: status
    });
  }
  }
  onSubmit(){
    
    if(this.locationForm.valid){
      const formData = this.locationForm.value;    
      formData.status = formData.status ? 1 : 0;  // If checked, 1; if unchecked, 0
     formData.hadAdmin=Number(localStorage.getItem("UserId"));
      this.locationService.addlocation(formData).subscribe(response=>{        
      
          Swal.fire({
            icon: 'success',
            title: this.locationForm.value.id > 0 ? 'Location Updated Successfully' : 'Location Add Successfully',
            text:  `Location ${
              this.locationForm.value.id  > 0 ? 'updated Successfully' : 'Add Successfully'
            }.`,
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Close the modal after the user clicks "OK"
            this.closeModal();
          });
      });      
    }
    else{
      this.locationForm.markAllAsTouched(); 
    }
  }

  openModal() {   
    this.isModalOpen = true;
  }
  closeModal() {
    
 //   this.previewImage=null;
    this.close.emit(); // Emit close event
  }
}
