import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-locationviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locationviewmodel.component.html',
  styleUrl: './locationviewmodel.component.css'
})
export class LocationviewmodelComponent {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();

  constructor(){

  }  
  closeModal() {
    this.close.emit(); // Emit close event    
  }
}
