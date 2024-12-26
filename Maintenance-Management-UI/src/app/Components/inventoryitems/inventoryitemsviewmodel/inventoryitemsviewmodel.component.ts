import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryItem } from '../../../Model/InventoryItem.model';

@Component({
  selector: 'app-inventoryitemsviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventoryitemsviewmodel.component.html',
  styleUrl: './inventoryitemsviewmodel.component.css'
})
export class InventoryitemsviewmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<any[]>();
 selectedItem!: InventoryItem;
  ngOnInit(): void {
    if(this.item){
      this.selectedItem=this.item
    }
  }
  closeModal() {
    this.close.emit(); // Emit close event
  }
}
