import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../Service/inventory.service';
import { CommonService } from '../../Service/common.service';
import { InventoryItem } from '../../Model/InventoryItem.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {

  isModalOpen=false;
   inventory!: InventoryItem[];
    filteredinventory!: InventoryItem[];

  constructor(private inventoryService: InventoryService,private commonService: CommonService){}

  ngOnInit(): void {
    const UserId = Number(localStorage.getItem('UserId'));
    this.inventoryService.getinventory(UserId).subscribe((response) => {
      this.inventory = response;
      this.filteredinventory = this.inventory;
      console.log(response);
    }); 
  }
  openModal() {
    this.isModalOpen = true;
  }
  closeModal(){
    this.isModalOpen = false;
  }
}
