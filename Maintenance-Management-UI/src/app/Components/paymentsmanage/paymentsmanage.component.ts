import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../Service/payment.service';
import { Payemnt } from '../../Model/payment.model';

@Component({
  selector: 'app-paymentsmanage',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './paymentsmanage.component.html',
  styleUrl: './paymentsmanage.component.css'
})
export class PaymentsmanageComponent {
  isLoading: boolean = false;
  payment!:Payemnt[];
  filteredpayment!:Payemnt[];
  hover = false;  
  copied = false;
  constructor(private paymentService:PaymentService){}

  ngOnInit() {
    this.showLoader();
    const userId = Number(localStorage.getItem('UserId'));
    this.paymentService.getPayment(userId).subscribe((response) => {
      this.payment = response;
      this.filteredpayment = this.payment;
    });
  }
 
  copyToClipboard(paymentId: string): void {
    // Create a temporary input element to copy the paymentId
    const tempInput = document.createElement('input');
    tempInput.value = paymentId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');  // Copy the value to the clipboard
    document.body.removeChild(tempInput);

    // Change the tooltip text to "Copied"
    this.copied = true;

    // Reset the copied status after 2 seconds
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }
  showLoader() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 400); // 1000ms = 1 second
  }
}
