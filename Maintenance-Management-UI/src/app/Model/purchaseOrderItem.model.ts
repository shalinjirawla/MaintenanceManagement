import { InventoryItem } from "./InventoryItem.model";
import { PurchaseOrder } from "./purchaseOrder.model";

export class PurchaseOrderItem {
    id!: number; // Unique identifier for the purchase order
    itemName!: string; // Title or description of the order
    cost!: number; // Cost per unit of the item 
    quantity!: number; // Quantity of the item being ordered
    inventoryItemId!:number
    purchaseOrderId: number | null = null; 
    inventoryItem?:InventoryItem;
    purchaseOrder?:PurchaseOrder;
    taxes!:number| null;

}