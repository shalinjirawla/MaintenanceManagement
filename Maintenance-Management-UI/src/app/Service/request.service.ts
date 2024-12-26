import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  identity,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Request } from '../Model/request.model';
import { WorkRequestWithStatusDto } from '../Model/WorkRequestWithStatusDto';
import { Filter } from '../Model/filter.model';
import { FeedbackComponent } from '../Components/feedback/feedback.component';
import { CustomerFeedback } from '../Model/customerFeedback.model';
import { Complaint } from '../Model/complaint.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = 'https://localhost:7025/api/Request';

  private requestSubject = new BehaviorSubject<WorkRequestWithStatusDto[]>([]);
  request$ = this.requestSubject.asObservable();

  constructor(private http: HttpClient) {}

  createRequest(formData: FormData): Observable<any> {    
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
      withCredentials: true, // This may help with CORS issues
    };
    return this.http
      .post<any>(`${this.apiUrl}`, formData)
      .pipe(catchError(this.handleError));
  }

  GetByIdRequest(id: number): Observable<WorkRequestWithStatusDto[]> {
    return this.http
      .get<WorkRequestWithStatusDto[]>(`${this.apiUrl}/${id}`)
      .pipe(
        tap((request) => this.requestSubject.next(request)),
        catchError(this.handleError)
      );
  }
  GetByRoleIdRequest(id: number): Observable<WorkRequestWithStatusDto[]> {
    return this.http
      .get<WorkRequestWithStatusDto[]>(`${this.apiUrl}/getrolebyadmin/${id}`)
      .pipe(
        tap((request) => this.requestSubject.next(request)),
        catchError(this.handleError)
      );
  }

  GetAllRequests(): Observable<WorkRequestWithStatusDto[]> {
    return this.http
      .get<WorkRequestWithStatusDto[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }
  sendEmail(emailPayload: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/sendEmail`, emailPayload)
      .pipe(catchError(this.handleError));
  }

  UpdateQuotationstatus(id: number): Observable<boolean> {
    return this.http
      .put<boolean>(`${this.apiUrl}/acceptQuotation?id=${id}`, {})
      .pipe(catchError(this.handleError));
  }

  deleterequest(id: number[]): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/requestsdelete`, { body: id })
      .pipe(catchError(this.handleError));
  }

  requestdecline(id: number, declineReason: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/decline`, { id, declineReason })
      .pipe(catchError(this.handleError));
  }

  filterdata(item: Filter): Observable<WorkRequestWithStatusDto[]> {
    let params = new HttpParams();
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<WorkRequestWithStatusDto[]>(
      `${this.apiUrl}/Filterdata`,
      { params }
    );
  }

  completeworkorder(formData: CustomerFeedback): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Addfeedback`, formData)
      .pipe(catchError(this.handleError));
  }

  addcomplaint(formData: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/Addcomplaint`, formData)
      .pipe(catchError(this.handleError));
  }

  GetComplaint(id: number): Observable<Complaint[]> {
    return this.http
      .get<Complaint[]>(`${this.apiUrl}/Getcomplaintcustomer/${id}`)
      .pipe(catchError(this.handleError));
  }

  updatecomplaintstatus(id: number, status: number): Observable<any> {
    // Create the request body with the status
    const body = { status };
    // Use PUT to send the status in the request body
    return this.http
      .put<any>(`${this.apiUrl}/Updatecomplaintstatus/${id}`, body)
      .pipe(catchError(this.handleError));
  }

  Getfeedback(id: number): Observable<CustomerFeedback[]> {
    return this.http.get<CustomerFeedback[]>(
      `${this.apiUrl}/getfeedbackbyadmin/${id}`
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
