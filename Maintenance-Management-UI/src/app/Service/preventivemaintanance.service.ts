import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { PreventiveMaintenance } from '../Model/PreventiveMaintenance.model';
import { Filter } from '../Model/filter.model';

@Injectable({
  providedIn: 'root',
})
export class PreventivemaintananceService {
  private apiUrl = 'https://localhost:7025/api/PreventiveMaintenance';

  constructor(private http: HttpClient) {}

  addMaintenance(data: PreventiveMaintenance): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, data)
      .pipe(catchError(this.handleError));
  }
  GetAll(): Observable<PreventiveMaintenance[]> {
    return this.http.get<PreventiveMaintenance[]>(`${this.apiUrl}`);
  }

  GetAllPreventiveMaintenance(id: number): Observable<PreventiveMaintenance[]> {
    return this.http.get<PreventiveMaintenance[]>(`${this.apiUrl}/${id}`);
  }

  // Delete preventive maintenance record
  deletePreventiveMaintenance(id: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletepm`, { body: id });
  }


  filterdata(item: Filter): Observable<PreventiveMaintenance[]> {
    // Create HttpParams
    let params = new HttpParams();
    // Iterate over properties in the Filter object
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<PreventiveMaintenance[]>(`${this.apiUrl}/Filterdata`, {
      params,
    });
  }

  // Error handling method
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!'; // Default error message

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage); // Log error to console
    return throwError(() => new Error(errorMessage)); // Throw error for further handling
  }
}
