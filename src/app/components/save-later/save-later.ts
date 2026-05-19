import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CategoryLabelPipe } from '../../pipes/category-label.pipe';
import { SaveLaterService } from '../../services/save-later.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-save-later',
  standalone: true,
  imports: [CommonModule, CategoryLabelPipe],
  templateUrl: './save-later.html',
  styleUrl: './save-later.css',
})
export class SaveLater {
  private saveLaterService = inject(SaveLaterService);
  private cartService = inject(CartService);
  private router = inject(Router);

  savedItems = this.saveLaterService.savedLater;

  moveToCart(item: CartItem) {
    this.saveLaterService.moveToCart(item);
    this.cartService.addCartItemToCart(item);
  }

  remove(id: string) {
    this.saveLaterService.removeFromSaved(id);
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }

  getDiscountPrice(item: CartItem): number {
    return this.cartService.getDiscountPrice(item);
  }
}
