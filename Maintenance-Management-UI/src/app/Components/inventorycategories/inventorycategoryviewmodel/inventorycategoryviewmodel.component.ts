import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Inventorycategories } from '../../../Model/InventoryCategory.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventorycategoryviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventorycategoryviewmodel.component.html',
  styleUrl: './inventorycategoryviewmodel.component.css'
})
export class InventorycategoryviewmodelComponent {
 @Input() item: any;
  @Output() close = new EventEmitter<void>();

   isViewModalOpen = true;
    selectedItem!: Inventorycategories;
    constructor() {}
    ngOnInit(): void {
      if(this.item){
        this.selectedItem=this.item;
      }
    }
  closeModal() {
    this.close.emit(); // Emit close event
  }
}
