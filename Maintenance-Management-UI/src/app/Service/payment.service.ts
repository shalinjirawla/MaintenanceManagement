import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PaymentIntent } from '@stripe/stripe-js';
import { Payemnt } from '../Model/payment.model';
import { Filter } from '../Model/filter.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'https://localhost:7025/api/Payment';

  constructor(private http: HttpClient) {}

   //Stripe transaction
  createPaymentIntent(formdata: FormGroup): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${this.apiUrl}/create-payment-intent`,
      formdata
    );
  }
 
  //Add Transaction history 
  addTransaction(formdata: Payemnt): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addtransaction`, formdata);
  }

  // Get Transaction history
  getPayment(id: number): Observable<Payemnt[]> {
    return this.http.get<Payemnt[]>(`${this.apiUrl}/getpayment/${id}`);
  }

  //Advance Filter payment 
  filterdata(item: Filter): Observable<Payemnt[]> {
    // Create HttpParams
    let params = new HttpParams();
    // Iterate over properties in the Filter object
    Object.entries(item).forEach(([key, value]) => {
      // Append each key-value pair, including those with undefined or null values
      params = params.append(key, value !== undefined ? value : '');
    });
    return this.http.get<Payemnt[]>(`${this.apiUrl}/FilterPayment`, { params });
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
