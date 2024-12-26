import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Notification } from '../Model/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'https://localhost:7025/api/Notification';

  constructor(private http: HttpClient) {}

  SendMessage(data: Notification): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, data)
      .pipe(catchError(this.handleError));
  }
  GetMessage(id: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.apiUrl}/getnotification/${id}`
    );
  }

  markadread(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/markasread/${id}`, {});
  }

  markasAllread(id: number, message: string): Observable<boolean> {
    const data = {
      id,
      message,
    };
    return this.http.post<boolean>(`${this.apiUrl}/markasallread`, data);
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
