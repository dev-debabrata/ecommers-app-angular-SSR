import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { OrderService } from '../../../services/order.service';
import { LoaderService } from '../../../services/loader.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { CartService } from '../../../services/cart.service';
import { RazorpayService } from '../../../services/razorpay.service';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { PaymentMethod } from '../../../models/payment.model';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css',
})
export class PaymentPage {
  private router = inject(Router);
  private orderService = inject(OrderService);
  private loaderService = inject(LoaderService);
  private snackbar = inject(SnackbarService);
  private cartService = inject(CartService);
  private razorpayService = inject(RazorpayService);
  private destroyRef = inject(DestroyRef);

  selectedMethod = signal<PaymentMethod>('cod');
  orderData = signal<any>(null);

  form = {
    upiId: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  };

  constructor() {
    const nav = this.router.currentNavigation();
    const state = nav?.extras?.state as { orderData: any };

    if (state?.orderData) {
      this.orderData.set(state.orderData);
    } else {
      this.snackbar.error('Session expired. Please try again.');
      this.router.navigate(['/']);
    }
  }

  select(method: PaymentMethod) {
    this.selectedMethod.set(method);
  }

  payNow() {
    const data = this.orderData();
    if (!data) {
      this.snackbar.error('Order data missing!');
      return;
    }

    if (this.selectedMethod() === 'cod') {
      this.createOrder('cod', 'confirmed', 'cod');
      return;
    }

    this.razorpayService.openPayment(
      data,
      this.selectedMethod(),

      (paymentId: string) => {
        this.createOrder(this.selectedMethod(), 'paid', paymentId);
      },

      () => {
        this.snackbar.error('Payment cancelled.');
      },

      (error: any) => {
        this.snackbar.error('Payment failed: ' + error.description);
      },
    );
  }

  private createOrder(paymentMethod: string, status: string, razorpayPaymentId: string) {
    const data = this.orderData();
    this.loaderService.show();

    const order = {
      ...data,
      paymentMethod,
      status,
      razorpayPaymentId,
    };

    const sub = this.orderService.createOrder(data.userId, order).subscribe({
      next: (res) => {
        this.loaderService.hide();
        this.cartService.clearCart();
        this.snackbar.success('Order placed successfully!');
        this.router.navigate(['/cart/order-success', res.orderId]);
      },
      error: (err) => {
        this.loaderService.hide();
        this.snackbar.error('Order save failed! Contact support.');
        console.error(err);
      },
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
