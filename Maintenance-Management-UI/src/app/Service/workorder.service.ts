import { Injectable } from '@angular/core';
import { HttpClient,  HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  throwError,
} from 'rxjs';
import { WorkRequestWithStatusDto } from '../Model/WorkRequestWithStatusDto';
import { Workorder } from '../Model/workorder.model';
import { Filter } from '../Model/filter.model';
import { WorkOrderCompletion } from '../Model/workOrderCompletion .model';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  private apiUrl = 'https://localhost:7025/api/WorkOrder';

  private requestSubject = new BehaviorSubject<WorkRequestWithStatusDto[]>([]);
  request$ = this.requestSubject.asObservable();

  constructor(private http: HttpClient) {}

  createWorkOrder(formData: Workorder): Observable<any> {
      
    const modifiedFormData = { ...formData, location: formData.location.toString() };
    return this.http
      .post<any>(`${this.apiUrl}`, modifiedFormData)
      .pipe(catchError(this.handleError));
  }

  Deleteworkorder(id:number[]): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteworkorders`,{body:id}).pipe(
      catchError(this.handleError) // Add error handling here
    );
  }


  GetAllWorkOrder(): Observable<Workorder[]> {
    return this.http
      .get<Workorder[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  GetByRoleIdWorkOrder(id: number, role: string): Observable<Workorder[]> {
    return this.http.get<Workorder[]>(
      `${this.apiUrl}/GetbyRoleId?id=${id}&role=${role}`
    );
  }

  updateworkorderstatus(item: Workorder): Observable<any> {
    return this.http.put<Workorder>(`${this.apiUrl}/UpdateStatus`, item);
  }
  editworkorder(item: Workorder): Observable<any> {
    
    return this.http.put<Workorder>(`${this.apiUrl}/Updateworkorder`, item);
  }
  filterdata(item: Filter): Observable<Workorder[]> {
    // Create HttpParams
    let params = new HttpParams();
    // Iterate over properties in the Filter object
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<Workorder[]>(`${this.apiUrl}/Filterdata`, { params });
  }

  completeworkorder(formData: WorkOrderCompletion): Observable<any> {
    
    return this.http
      .post<any>(`${this.apiUrl}/Completeworkorder`, formData)
      .pipe(catchError(this.handleError));
  }
  Getreviewworkorder(id: number): Observable<WorkOrderCompletion> {
    return this.http.get<WorkOrderCompletion>(`${this.apiUrl}/review/${id}`);
  }

  GetPreviousassignemployee(id: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/getPreviousassignemployee/${id}`
    );
  }

  // Error handling method
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!'; // Default error message
    return throwError(() => new Error(errorMessage)); // Throw error for further handling
  }
}
