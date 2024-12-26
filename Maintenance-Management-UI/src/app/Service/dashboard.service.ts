import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { DashboardCounts } from '../Model/DashboardCounts.model';


@Injectable({
  providedIn: 'root'
})  
export class DashboardService {

   private apiUrl = 'https://localhost:7025/api';

   constructor(private http: HttpClient) { }

    getPeopleAllcount(id: number): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/User/getuserscount/${id}`).pipe(
            catchError(this.handleError)
        );
    }  
    Getfeedbackcount(id: number): Observable<DashboardCounts> {    
         return this.http.get<DashboardCounts>(`${this.apiUrl}/Request/getfeedbackbyadmincount/${id}`);
    }
    GetComplaintcount(id:number): Observable<number>{
        return this.http.get<number>(`${this.apiUrl}/Request/Getcomplaintcustomercount/${id}`).pipe(
          catchError(this.handleError)
        );
    }
    GetAllRequestscount(id:number):Observable<DashboardCounts>{
        return this.http.get<DashboardCounts>(`${this.apiUrl}/Request/getrequestcount/${id}`).pipe(catchError(this.handleError));
    }
    GetAllWorkOrdercount(id:number):Observable<DashboardCounts>{        
        return this.http.get<DashboardCounts>(`${this.apiUrl}/WorkOrder/wocount/${id}`).pipe(
          catchError(this.handleError) 
        );
    }
    getPaymentStats(id:number):Observable<DashboardCounts>{
      return this.http.get<DashboardCounts>(`${this.apiUrl}/WorkOrder/wopaymentcount/${id}`).pipe(
        catchError(this.handleError) 
      );
    }

    getInventory(id:number):Observable<DashboardCounts[]>{
      return this.http.get<DashboardCounts[]>(`${this.apiUrl}/Inventory/inventorycount/${id}`).pipe(
        catchError(this.handleError) 
      );
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


