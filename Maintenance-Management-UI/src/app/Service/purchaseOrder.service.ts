import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventorycategories } from '../Model/InventoryCategory.model';
import { InventoryItem } from '../Model/InventoryItem.model';
import { PurchaseOrder } from '../Model/purchaseOrder.model';
import { Filter } from '../Model/filter.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private apiUrl = 'https://localhost:7025/api/PurchaseOrder';

  constructor(private http: HttpClient) {}

  addPurchaseOrder(formData: PurchaseOrder): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/addpurchaseorder`, formData);
  }
  GetPurchaseOrder(id: number): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(
      `${this.apiUrl}/getpuchaseorderlist/${id}`
    );
  }
  getByIdpurchaseOrder(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(
      `${this.apiUrl}/getbyidpurchaseorder/${id}`
    );
  }
  deletepurchaseorder(id: number[]): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deletepurchaseorder`, {
      body: id,
    });
  }
  UpdatePurchseorderStatus(status: string, id: number): Observable<any> {
    const payload = { status, id };
    return this.http.put<any>(`${this.apiUrl}/updatestatus`, payload);
  }
  //Advance Filter purchase order
  filterdata(item: Filter): Observable<PurchaseOrder[]> {
    // Create HttpParams
    let params = new HttpParams();
    // Iterate over properties in the Filter object
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/FilterPurchseOrder`, {
      params,
    });
  }
  checkPoNoExists(ponumber: string, id: number,uid:number): Observable<boolean> {
    debugger;
    return this.http.get<boolean>(
      `${this.apiUrl}/exists?ponumber=${ponumber}&id=${id}&uid=${uid}`
    );
  }
}
