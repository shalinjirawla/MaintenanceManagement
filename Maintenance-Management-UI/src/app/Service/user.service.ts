import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Login } from '../Model/login.model';
import { Role } from '../Model/role.model';
import { Filter } from '../Model/filter.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7025/api/User';

  constructor(private http: HttpClient) {}

  registerpeople(user: Login): Observable<number> {
    return this.http
      .post<number>(`${this.apiUrl}/register`, user)
      .pipe(catchError(this.handleError));
  }

  getEmployeesAll(id: number): Observable<Login[]> {
    return this.http
      .get<Login[]>(`${this.apiUrl}/getusers/${id}`)
      .pipe(catchError(this.handleError));
  }

  getEmployees(
    startDate: string,
    endDate: string,
    hadid: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/GetAvailableEmployees?startDate=${startDate}&endDate=${endDate}&hadid=${hadid}`
    );
  }
  getRoles(role: string): Observable<Role[]> {
    return this.http
      .get<Role[]>(`${this.apiUrl}/getUserRole/${role}`)
      .pipe(catchError(this.handleError));
  }
  deleteEmployees(ids: number[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteusers`, { body: ids });
  }
  filterdata(item: Filter): Observable<Login[]> {
    // Create HttpParams
    let params = new HttpParams();
    // Iterate over properties in the Filter object
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<Login[]>(`${this.apiUrl}/Filterdata`, { params });
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
