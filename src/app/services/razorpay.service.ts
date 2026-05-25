import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { PaymentData, PaymentMethod } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class RazorpayService {
  private loadRazorpay(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  async openPayment(
    orderData: PaymentData,
    method: PaymentMethod,
    onSuccess: (paymentId: string) => void,
    onCancel: () => void,
    onError: (error: any) => void,
  ): Promise<void> {
    await this.loadRazorpay();

    const amountInPaise = Math.round(orderData.total * 100);

    const options = {
      key: environment.razorpayKey,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Your Store Name',
      description: 'Order Payment',
      prefill: {
        name: orderData.address?.fullName || '',
        email: orderData.userEmail || '',
        contact: orderData.address?.phone || '',
      },
      notes: {
        userId: orderData.userId,
      },
      theme: {
        color: '#f76707',
      },
      method: this.getMethodKey(method),

      handler: (response: any) => {
        console.log('Payment Success:', response);
        onSuccess(response.razorpay_payment_id);
      },

      modal: {
        ondismiss: () => {
          onCancel();
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      console.error('Payment Failed:', response.error);
      onError(response.error);
    });

    rzp.open();
  }

  private getMethodKey(method: string): string | undefined {
    const map: Record<string, string> = {
      upi: 'upi',
      card: 'card',
      emi: 'emi',
      netbanking: 'netbanking',
    };
    return map[method] ?? undefined;
  }
}
