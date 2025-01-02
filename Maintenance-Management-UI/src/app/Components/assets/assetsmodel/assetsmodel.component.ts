import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssetsService } from '../../../Service/assets.service';
import Swal from 'sweetalert2';
import { noWhitespaceValidator } from '../../validation/custom-validators';

@Component({
  selector: 'app-assetsmodel',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './assetsmodel.component.html',
  styleUrl: './assetsmodel.component.css'
})
export class AssetsmodelComponent implements OnInit{
  @Input() item: any;
  @Input() mode: 'edit' | 'view' | 'add' = 'view'; 
  @Output() close = new EventEmitter<void>();
  isModalOpen = false;
  errorMessage: string = '';  
  isViewMode: boolean = false; 
  assetsForm!: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(private fb: FormBuilder,
    private assetsService:AssetsService
  ){
    this.assetsForm = this.fb.group({
      id: [0],
      assetName: ['', [Validators.required,noWhitespaceValidator]],
      description: ['', [Validators.required,noWhitespaceValidator]],
      model: ['', [Validators.required,noWhitespaceValidator]],
      serialNumber: ['', [Validators.required,noWhitespaceValidator]],
      category: ['', [Validators.required,noWhitespaceValidator]],
      location: ['', [Validators.required,noWhitespaceValidator]],
      purchaseDate: ['', Validators.required],
      warrantyExpiration: ['', Validators.required],
      condition: ['', [Validators.required,noWhitespaceValidator]],
      assetImage:[''],
      hadadmin:[localStorage.getItem("UserId")]
    });
  }

  ngOnInit(): void {
    this.fetchvalue();
  }
  fetchvalue() {    
    if (this.item) {
            
      this.previewImage = this.item.assetImage ? this.item.assetImage : null;
      const formattedPurchaseDate = this.item.purchaseDate ? new Date(this.item.purchaseDate).toISOString().split('T')[0] : '';
      const formattedWarrantyExpiration = this.item.warrantyExpiration ? new Date(this.item.warrantyExpiration).toISOString().split('T')[0] : '';
      this.assetsForm.patchValue({
        id: this.item.id,
        assetName: this.item.assetName,
        description: this.item.description,
        model: this.item.model,
        serialNumber: this.item.serialNumber,
        category: this.item.category,
        location: this.item.location,
        purchaseDate: formattedPurchaseDate,
        warrantyExpiration: formattedWarrantyExpiration,
        condition: this.item.condition,
       // assetImage: this.item.assetImage,
        hadadmin: this.item.hadadmin,
      });
    }
  }
  //Add/edit asset
  onSubmit(){    
    if(this.assetsForm.valid){
      const formData = new FormData();
      Object.keys(this.assetsForm.value).forEach(key => {
        formData.append(key, this.assetsForm.value[key]);
      });      
      if (this.selectedFile) {  
        formData.append('images', this.selectedFile, this.selectedFile.name);
      }    
      this.assetsService.addassets(formData).subscribe(response=>{        
        Swal.fire({
          icon: 'success',
          title: this.assetsForm.value.id > 0 ? 'Asset Updated Successfully' : 'Asset Add Successfully',
          text:  `Asset ${
            this.assetsForm.value.id  > 0 ? 'updated Successfully' : 'Add Successfully'
          }.`,
          confirmButtonColor: '#3085d6',
        }).then(() => {
          // Close the modal after the user clicks "OK"
          this.closeModal();
        });
      });      
    }
    else{
      this.assetsForm.markAllAsTouched();
    }
  }
  //image select
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Store the selected file
    if (this.selectedFile) {  // Only read the file if it is not null
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  //Model Open
  openModal() {   
    this.isModalOpen = true;
  }
  //Model Close
  closeModal() {    
    this.previewImage=null;
    this.close.emit(); // Emit close event
  }
}
