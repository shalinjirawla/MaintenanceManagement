import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Login } from '../Model/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'https://localhost:7025/api/Auth';

  constructor(private http: HttpClient) {}

  GetAllAdmin(): Observable<Login[]> {
    return this.http
      .get<Login[]>(`${this.apiUrl}/getalladmins`)
      .pipe(catchError(this.handleError));
  }
  authenticaluser(user: Login): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }
  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return new Observable((observer) => {
        observer.next({
          message: 'No token found, user is already logged out',
        });
        observer.complete();
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post(`${this.apiUrl}/logout`, {}, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';

    // Check if the error object has a message
    if (error && error.message) {
      errorMessage = error.message;
    } else if (error && error.status) {
      // Server-side error or network error
      errorMessage = `Error Code: ${error.status}\nMessage: ${
        error.message || 'Network error'
      }`;
    }

    console.error(errorMessage); // Log error to console
    return throwError(() => new Error(errorMessage)); // Throw error for further handling
  }
}
