import { Login } from "./login.model";

export interface Vendor {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  contactPerson: string;
  hadAdminId: number;
  // hadAdmin?:Login;
  isActive: boolean;
  companyName:string;
  selected?: boolean;
}
