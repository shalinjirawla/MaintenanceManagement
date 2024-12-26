export class MaintenanceItem {
    id!: number;                        // Item ID
    name!: string;                      // Item Name
    cost!: number;                      // Item Cost
    quantity!: number;                  // Item Quantity
    tax!: number;                       // Item Tax
    inventoryItemId!:number;
    completedWorkOrderId: number | null = null; 
   
  }