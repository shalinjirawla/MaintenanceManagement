import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventorycategories } from '../Model/InventoryCategory.model';
import { InventoryItem } from '../Model/InventoryItem.model';
import { PurchaseOrder } from '../Model/purchaseOrder.model';

@Injectable({
  providedIn: 'root'
})  
export class PurchaseOrderService {

   private apiUrl = 'https://localhost:7025/api/PurchaseOrder';

   constructor(private http: HttpClient) { }

   addPurchaseOrder(formData: PurchaseOrder): Observable<number> {
    
    return this.http.post<number>(`${this.apiUrl}/addpurchaseorder`, formData);
  }
  GetPurchaseOrder(id:number):Observable<PurchaseOrder[]>{
    
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/getpuchaseorderlist/${id}`);
  }  
  getByIdpurchaseOrder(id:number):Observable<PurchaseOrder>{
    return this.http.get<PurchaseOrder>(`${this.apiUrl}/getbyidpurchaseorder/${id}`);
  }
  deletepurchaseorder(id:number[]):Observable<any>{
    
    return this.http.delete<any>(`${this.apiUrl}/deletepurchaseorder`,{body:id});
  }
  UpdatePurchseorderStatus(status:string,id:number):Observable<any>{
    
    const payload = { status, id }; 
    return this.http.put<any>(`${this.apiUrl}/updatestatus`,payload);
  }
  
}


