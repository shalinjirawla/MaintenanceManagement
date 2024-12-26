import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Asset } from '../Model/asset.model';
import { Filter } from '../Model/filter.model';
import { PreventiveMaintenance } from '../Model/PreventiveMaintenance.model';

@Injectable({
  providedIn: 'root'
})  
export class AssetsService {

   private apiUrl = 'https://localhost:7025/api/Asset';

   constructor(private http: HttpClient) { }

    addassets(formdata:FormData): Observable<any> {        
        return this.http.post<any>(`${this.apiUrl}`, formdata).pipe(catchError(this.handleError));
    }

    GetAssets(id:number): Observable<Asset[]>{
        return this.http.get<Asset[]>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
          );
    }
    deleteAsset(id:number[]): Observable<any> {      
      return this.http.delete(`${this.apiUrl}/deleteassets`, { body: id });
    }

    filterdata(item: Filter): Observable<Asset[]> {      
      // Create HttpParams
      let params = new HttpParams();
      // Iterate over properties in the Filter object
      Object.entries(item).forEach(([key, value]) => {
        // Append each key-value pair, including those with undefined or null values
        params = params.append(key, value !== undefined ? value : '');
      });
      return this.http.get<Asset[]>(`${this.apiUrl}/Filterdata`, { params });
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


