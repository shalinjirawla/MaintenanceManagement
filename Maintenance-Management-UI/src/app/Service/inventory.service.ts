import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Inventorycategories } from '../Model/InventoryCategory.model';
import { InventoryItem } from '../Model/InventoryItem.model';
import { Filter } from '../Model/filter.model';

@Injectable({
  providedIn: 'root'
})  
export class InventoryService {

   private apiUrl = 'https://localhost:7025/api/Inventory';

   constructor(private http: HttpClient) { }

   addinventorycategoty(formData: Inventorycategories): Observable<number> {
    
    return this.http.post<number>(`${this.apiUrl}`, formData);
  }
  
  getinventorycategoty(id:number):Observable<Inventorycategories[]>{
    
    return this.http.get<Inventorycategories[]>(`${this.apiUrl}/getinventorycategory/${id}`);
  }

  Deleteinventorycategoty(id:number[]):Observable<any>{
    
    return this.http.delete<any>(`${this.apiUrl}/deleteinventorycategory`,{body:id});
  }
  addinventoryitems(formData: InventoryItem){
    
    return this.http.post<number>(`${this.apiUrl}/additems`, formData);
  }
  getinventoryitems(id:number):Observable<InventoryItem[]>{
    
    return this.http.get<InventoryItem[]>(`${this.apiUrl}/getinventoryitems/${id}`);
  }
  Deleteinventoryitem(id:number[]):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/deleteinventoryItems`,{body:id});
  }

  FulfillQuantity(payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatequantity`, payload).pipe(
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('An error occurred while processing the request.'));
      })
    );
  }
  getinventory(id:number):Observable<InventoryItem[]>{
    
    return this.http.get<InventoryItem[]>(`${this.apiUrl}/getinventory/${id}`);
  }

    filterdata(item: Filter): Observable<InventoryItem[]> {
      // Create HttpParams
      let params = new HttpParams();
      // Iterate over properties in the Filter object
      Object.entries(item).forEach(([key, value]) => {
        // Append each key-value pair, including those with undefined or null values
        params = params.append(key, value !== undefined ? value : '');
      });
      return this.http.get<InventoryItem[]>(`${this.apiUrl}/Filterdata`, { params });
    }
    filtercategorydata(item: Filter): Observable<Inventorycategories[]> {
      // Create HttpParams
      let params = new HttpParams();
      // Iterate over properties in the Filter object
      Object.entries(item).forEach(([key, value]) => {
        // Append each key-value pair, including those with undefined or null values
        params = params.append(key, value !== undefined ? value : '');
      });
      return this.http.get<Inventorycategories[]>(`${this.apiUrl}/Filtercategorydata`, { params });
    }
  
}


