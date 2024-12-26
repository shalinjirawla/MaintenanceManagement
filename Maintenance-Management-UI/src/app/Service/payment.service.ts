import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PaymentIntent } from '@stripe/stripe-js';
import { Payemnt } from '../Model/payment.model';


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'https://localhost:7025/api/Payment';

  constructor(private http: HttpClient) {}

 createPaymentIntent(formdata: FormGroup): Observable<PaymentIntent> {
    
    return this.http.post<PaymentIntent>(
      `${this.apiUrl}/create-payment-intent`,
       formdata 
    );
  }
  addTransaction(formdata:Payemnt): Observable<any>{
    
    return this.http.post<any>(
        `${this.apiUrl}/addtransaction`,
         formdata 
      );
  }
  getPayment(id:number):Observable<Payemnt[]>{
    return this.http.get<Payemnt[]>(`${this.apiUrl}/getpayment/${id}`)
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
