import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth-user.service';
import { TruncatePipe } from '../../../../pipes/truncate.pipe';
import { OrderService } from '../../../../services/order.service';
import { LoaderService } from '../../../../services/loader.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { CartItem } from '../../../../models/cart.model';
import { CheckoutAddress } from '../checkout-address/checkout-address';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TruncatePipe, CheckoutAddress],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {
  public cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);
  private loaderService = inject(LoaderService);
  private snackbar = inject(SnackbarService);
  // private platformId = inject(PLATFORM_ID);

  user = signal<any>(null);
  selectedAddress = signal<any>(null);

  checkoutForm = signal({
    shippingMethod: 'free',
  });

  // !isPlatformBrowser(this.platformId) &&

  ngOnInit(): void {
    if (this.cartService.cart().length === 0) {
      this.router.navigate(['/']);
      return;
    }

    const sub = this.authService.getFullUser().subscribe({
      next: (user: any) => {
        if (user) {
          this.user.set(user);

          this.checkoutForm.update((form) => ({
            ...form,
            fullName: user.firstName + ' ' + user.lastName,
            email: user.email,
            phone: user.phoneNumber?.[0] || '',
          }));
        }
      },

      error: (err) => {
        console.error('User fetch error:', err);
      },
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  onAddressSelect(addr: any) {
    this.selectedAddress.set(addr);
  }

  setShippingMethod(method: 'free' | 'express') {
    this.checkoutForm.update((f) => ({
      ...f,
      shippingMethod: method,
    }));
  }

  getDiscountPrice(item: CartItem): number {
    return this.cartService.getDiscountPrice(item);
  }

  shippingPrice = computed(() => (this.checkoutForm().shippingMethod === 'express' ? 90 : 0));

  subTotal = computed(() => {
    return this.cartService.totalPrice();
  });

  gst = computed(() => this.subTotal() * 0.18);

  totalPrice = computed(() => this.subTotal() + this.gst() + this.shippingPrice());

  submitOrder() {
    if (!this.selectedAddress()) {
      this.snackbar.error('Please Select addresss!');
      return;
    }

    const user = this.user();
    if (!user?.uid) {
      this.snackbar.error('User not found!');
      return;
    }

    this.loaderService.show();

    const order: Order = {
      userEmail: user.email,
      userId: user.uid,
      address: this.selectedAddress(),
      shippingMethod: this.checkoutForm().shippingMethod,
      items: this.cartService.cart().map((item) => ({
        productId: item.id,
        title: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount || 0,
      })),
      subTotal: this.subTotal(),
      gst: this.gst(),
      total: this.totalPrice(),
      status: 'pending',
      createdAt: Date.now(),
    };

    const orderSub = this.orderService.createOrder(user.uid, order).subscribe({
      next: (res) => {
        this.loaderService.hide();

        this.cartService.clearCart();
        this.snackbar.success('Order placed!');
        this.router.navigate(['/order-success', res.id]);
      },

      error: (err) => {
        this.loaderService.hide();
        this.snackbar.error('Order failed!');
        console.log(err);
      },
    });

    this.destroyRef.onDestroy(() => {
      orderSub.unsubscribe();
    });
  }
}
