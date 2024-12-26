import { DecimalPipe } from "@angular/common";
import { Login } from "./login.model";

export class Workorder {
    id!:number;
    title!: string;
    description!:string;
    priority!: string;
    image!: string;
    status!: string;
    category!:string;
    createdBy!: number
    createdByUser?:Login;
    createdDate!: Date;
    estimatedCost?:number;
    location!:number;  
    locationName!:string;  
    approvedBy!: number;
    approvedDate!:Date;
    startDate!:Date;
    dueDate!:Date;
    assignedTo!:number;
    assignedToUser?:string;
    asset!:string;
    requestedId!:number;
    additionalWorkers!:string;
    completedBy!:number;
    comment!:string;
    lastUpdate!:Date;
    dateCompleted!:Date;
    selected?: boolean;
    requestedToUser?:string;    
    emailCustomer?:string;
    payment?:string;

}



