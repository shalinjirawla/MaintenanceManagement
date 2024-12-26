import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PreventiveMaintenance } from '../../../Model/PreventiveMaintenance.model';

@Component({
  selector: 'app-preventiveviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preventiveviewmodel.component.html',
  styleUrl: './preventiveviewmodel.component.css'
})
export class PreventiveviewmodelComponent implements OnInit {
  @Input() item!: any;
  @Output() close = new EventEmitter<void>();
  isViewModalOpen = false;
  preventive!:PreventiveMaintenance;

ngOnInit(): void {
  
  if(this.item){
    //this.preventive=this.item;
  }
}

  closeModal() {
    
    this.close.emit(); // Emit close event
  }

  openModal() {
    this.isViewModalOpen = true;
  }
}
