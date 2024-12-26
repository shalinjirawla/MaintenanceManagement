import { InventoryItem } from "./InventoryItem.model";
import { PurchaseOrderItem } from "./purchaseOrderItem.model";
import { Vendor } from "./vendor.model";

export class PurchaseOrder {
    id!: number; // Unique identifier for the purchase order
    title!: string; // Title or description of the order
    orderNumber?: string; // Unique order number
    vendorId!: number; // Vendor supplying the items
    vendor?: Vendor; // Vendor details (optional)
    items!: number; // Reference to the item being ordered
    inventoryItem?: InventoryItem; // Inventory item details (optional)
    cost!: number; // Cost per unit of the item
    otherCost?: number; // Additional costs (optional)
    quantity!: number; // Quantity of the item being ordered
    totalAmount?: number; // Total amount for the order (calculated)
    expectedDeliveryDate!: Date; // Expected delivery date
    receivedDate?: Date; // Date the order was received (optional)
    dateCreated!: Date; // Date the order was created
    createdBy!: number; // User ID of the creator
    status!: string; // Status of the purchase order (e.g., Pending, Approved)
    vendorname?:string;
    purchaseOrderItems!:PurchaseOrderItem[];
    selected?: boolean;
}