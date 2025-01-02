import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-workorderviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workorderviewmodel.component.html',
  styleUrl: './workorderviewmodel.component.css'
})
export class WorkorderviewmodelComponent {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();

  constructor(){
  }  
  onModalClose() {
    this.close.emit(); // Emit close event    
  }
  overdue(): boolean {
    return new Date(this.item.dueDate) < new Date(); // Compare the due date with the current date and time
  }  
}
