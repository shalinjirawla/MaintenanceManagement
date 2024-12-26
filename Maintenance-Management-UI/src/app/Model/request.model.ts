import { DecimalPipe } from "@angular/common";
import { Login } from "./login.model";

export class Request {
    id!:number;
    title!: string;
    description!:string;
    priority!: string;
    image!: string;
    status!: string;
    createdBy!: number
    createdByUser?:Login;
    createdDate!: Date;
    estimatedCost?:DecimalPipe;
    location!:number;
    approvedBy!: number;
    approvedDate!:Date;
    hadAdminId!:number;
    selected?: boolean;
}