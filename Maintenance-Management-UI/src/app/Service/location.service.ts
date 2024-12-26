import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Location } from '../Model/Location.model';
import { Filter } from '../Model/filter.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'https://localhost:7025/api/Location';

  constructor(private http: HttpClient) {}

  addlocation(formdata: Location): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, formdata)
      .pipe(catchError(this.handleError));
  }
  GetAlllocation(): Observable<Location[]> {
    return this.http
      .get<Location[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  Getlocation(id: number): Observable<Location[]> {
    return this.http
      .get<Location[]>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  deleteLocation(id: number[]): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/delete`, { body: id });
  }
  filterdata(item: Filter): Observable<Location[]> { 
         
    // Create HttpParams
    let params = new HttpParams();
    // Iterate over properties in the Filter object
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<Location[]>(`${this.apiUrl}/Filterdata`, { params });
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
