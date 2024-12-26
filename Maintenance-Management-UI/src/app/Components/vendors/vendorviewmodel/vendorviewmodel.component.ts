import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vendor } from '../../../Model/vendor.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendorviewmodel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendorviewmodel.component.html',
  styleUrl: './vendorviewmodel.component.css',
})
export class VendorviewmodelComponent implements OnInit {
  @Input() item: any;
  @Output() close = new EventEmitter<void>();

  isViewModalOpen = true;
  selectedItem!: Vendor;

  constructor() {}
  ngOnInit(): void {
    if(this.item){
      this.selectedItem=this.item;
    }
  }

  closeModal() {
    this.close.emit();
  }
}
