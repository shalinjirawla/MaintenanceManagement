import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor } from '../Model/vendor.model';
import { Filter } from '../Model/filter.model';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private apiUrl = 'https://localhost:7025/api/Vendor';

  constructor(private http: HttpClient) {}

  registerVendor(formData: Vendor): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}`, formData);
  }

  getvendor(id: number): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/getvendor/${id}`);
  }

  Deletevendor(id: number[]): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deletevendor`, { body: id });
  }

  filterdata(item: Filter): Observable<Vendor[]> {
    // Create HttpParams
    let params = new HttpParams();
    // Iterate over properties in the Filter object
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<Vendor[]>(`${this.apiUrl}/Filterdata`, { params });
  }
}
