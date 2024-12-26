import { Inventorycategories } from "./InventoryCategory.model";
import { Login } from "./login.model";

export class InventoryItem {
    id!: number;
    name!: string;
    inventoryCategoryId!: number;
    inventoryCategory?: Inventorycategories | null;
    sku!: string;
    unit!:string;
    description!: string;
    availableQuantity?: number | null;
    allocatedQuantity?: number | null;
    onHandQuantity?: number | null;
    incomingQuantity?: number | null;
    minimumQuantity?: number | null;
    reorderLevel?: number | null;
    price?: number | null;
    taxes?:number| null;
    location!: string;   
    dateCreated: Date = new Date();
    status?: string | null;
    isActive?: boolean | null;
    hadAdminId!: number;
    hadAdmin?: Login | null;
    selected?: boolean;
    inventoryCategori?:string;
  }
  
  