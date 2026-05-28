import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { SaveLaterService } from '../../../services/save-later.service';
import { CartItem } from '../../../models/cart.model';
import { CategoryLabelPipe } from '../../../pipes/category-label.pipe';
import { SaveLater } from '../../../components/save-later/save-later';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CategoryLabelPipe, SaveLater],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  private router = inject(Router);
  private cartService = inject(CartService);
  private saveLaterService = inject(SaveLaterService);

  cart = this.cartService.cart;
  total = this.cartService.totalPrice;
  cartItemCount = this.cartService.itemCount;

  getDiscountPrice(item: CartItem): number {
    return this.cartService.getDiscountPrice(item);
  }

  remove(id: string) {
    this.cartService.removeItem(id);
  }

  changeQty(id: string, event: Event) {
    const value = +(event.target as HTMLSelectElement).value;
    this.cartService.updateQuantity(id, value);
  }

  getCheckout() {
    if (this.cart().length === 0) {
      return;
    }

    this.router.navigate(['/cart/checkout']);
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }

  addSaveForLater(item: CartItem) {
    this.cartService.removeItem(item.id);
    this.saveLaterService.saveForLater(item);
  }
}
