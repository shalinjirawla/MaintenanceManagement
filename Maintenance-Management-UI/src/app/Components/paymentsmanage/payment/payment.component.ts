import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {  NgxStripeModule,  StripeCardComponent,  StripeCardNumberComponent,  StripeService,} from 'ngx-stripe';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import {  FormBuilder,  FormGroup,  ReactiveFormsModule,  Validators,} from '@angular/forms';
import { StripeCardElementOptions,  StripeElementsOptions,} from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../../Service/payment.service';
import { response } from 'express';
import { Payemnt } from '../../../Model/payment.model';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,NgxStripeModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  @Input() item!: any;
  @Output() close = new EventEmitter<void>();
  @ViewChild('cardRef') cardRef!: StripeCardComponent; 

  public cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontWeight: 400,
        fontFamily: 'Circular',
        fontSize: '14px',
        iconColor: '#666EE8',
        color: '#002333',
        '::placeholder': {
          color: '#919191',
        },
      },
    },
  };

  public elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  paymentForm!: FormGroup;
  loading = false; 
  showModal = true;
  

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private paymentService:PaymentService
  ) {
    this.paymentForm = this.fb.group({      
      email: ['', [Validators.required]],
      amount: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    
    if(this.item){
      this.paymentForm.patchValue({
        amount: this.item.estimatedCost,      
        email:this.item.emailCustomer,
      });
    }  
  }

  pay(): void {
   
  if (this.paymentForm.valid) {
    this.loading = true; 
      // this.paymentService.createPaymentIntent(this.paymentForm.value)
      //   .pipe(
      //     switchMap((pi:any) => {
      //       
      //       if (!pi.client_secret) {
      //         throw new Error('Client secret is missing.');
      //       }
      //       return this.stripeService.confirmCardPayment(pi.client_secret, {
      //         payment_method: {
      //           card: this.card.element,
      //           billing_details: {
      //             name: this.paymentForm.get('name')?.value,
      //           },
      //         },
      //       });
      //     })
      //   )
      //   .subscribe((result) => {
      //     this.loading = false;   
      //     if (result.error) {
      //       
      //       // Show error to your customer (e.g., insufficient funds)
      //       console.log(result.error.message);
      //       Swal.fire({
      //         icon: 'error',
      //         title: 'Payment Failed',
      //         text: result.error.message,
      //         confirmButtonColor: '#d33',
      //       });
           
      //     } else {
      //       
      //       // The payment has been processed!
            
      //       if (result.paymentIntent.status === 'succeeded') {
      //         Swal.fire({
      //           icon: 'success',
      //           title: 'Payment Successful',
      //           text: 'Your payment has been successfully processed. Thank you!',
      //           confirmButtonColor: '#3085d6',
      //         }).then(() => {                
      //           this.showModal = false;                
      //         });
      //         const formData=new Payemnt();
      //         formData.id=0;
      //         if (result.paymentIntent.client_secret) 
      //         formData.paymentId = result.paymentIntent.client_secret;
      //         formData.amount=result.paymentIntent.amount.toString();
      //         formData.datetime = result.paymentIntent.created
      //            ? new Date(result.paymentIntent.created * 1000).toISOString()
      //            : new Date().toISOString();
      //         formData.email = this.paymentForm.value.email;
      //         formData.requestId=this.item.requestedId,
      //         formData.workorderId=this.item.id,
      //         formData.status=result.paymentIntent.status;
      //         this.paymentService.addTransaction(formData).subscribe(response=>{
      //            console.log(response);
      //         });
      //       }            
      //     }
      //   });
      this.paymentService.createPaymentIntent(this.paymentForm.value)
  .pipe(
    switchMap((pi: any) => {
      
      if (!pi.client_secret) {
        throw new Error('Client secret is missing.');
      }
      return this.stripeService.confirmCardPayment(pi.client_secret, {        
        payment_method: {
          card: this.cardRef.element,
          billing_details: {
            name: this.paymentForm.get('name')?.value,
          },
        },
      });
    })
  )
  .subscribe((result) => {
    this.loading = false;

    // Initialize formData regardless of success or failure
    const formData = new Payemnt();
    formData.id = 0;
    formData.paymentId = result.paymentIntent?.client_secret ?? '';
    formData.amount = ((result.paymentIntent?.amount ?? this.paymentForm.value.amount) / 100).toString();
    
    //formData.datetime = new Date(indiaTime);
    formData.email = this.paymentForm.value.email;
    formData.requestId = this.item.requestedId;
    formData.workorderId = this.item.id;
    formData.status = result.paymentIntent?.status ? result.paymentIntent.status.charAt(0).toUpperCase() + result.paymentIntent.status.slice(1): 'failed'; // Default to 'failed'

    if (result.error) {
      
      //console.log(result.error.message);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: result.error.message,
        confirmButtonColor: '#d33',
      }).then(() => {
        this.showModal = false;
        
      });

      // Save the failed transaction details
      this.paymentService.addTransaction(formData).subscribe(response => {
        console.log('Failed transaction saved:', response);
      });
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful',
          text: 'Your payment has been successfully processed. Thank you!',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.closeModal();
         // this.showModal = false;
        });

        // Save the successful transaction details
        this.paymentService.addTransaction(formData).subscribe(response => {
          console.log('Successful transaction saved:', response);
        });
      }
    }
  }, (error) => {
    console.error('An error occurred:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Something went wrong while processing the payment.',
      confirmButtonColor: '#d33',
    });
  });

    } else {
      console.log(this.paymentForm);
    }
  }
  closeModal() {
    
    this.close.emit(); // Emit close event
    // this.item = null; // Reset item
  }

  onCardLoaded(event: any) {
    this.cardRef = event.card;  // Ensure this.card is correctly set
  }
  
  // createPaymentIntent(formdata: FormGroup): Observable<PaymentIntent> {
  //   
  //   return this.http.post<PaymentIntent>(
  //     `${'https://localhost:7025/api/Payment'}/create-payment-intent`,
  //      formdata 
  //   );
  // }
}
