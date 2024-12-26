import { Login } from "./login.model";
import { Request } from "./request.model";
import { Workorder } from "./workorder.model";

export class Complaint{
  id!: number;
  customerID!: number;
  requesterUser?: Login; // Assuming requesterUser is a username or ID; change the type as necessary
  workRequestID !: number;
  workRequestFeed?:Workorder;
  title?: string;
  description?: string;
  priority?: string;
  attachment?: string;
  status!: number;
  complaintDate!:Date;
  location?:string; 
  asset?:string;
  category?:string;
  }

 