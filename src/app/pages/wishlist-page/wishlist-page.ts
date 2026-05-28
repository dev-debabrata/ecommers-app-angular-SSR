import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Rating } from '../../utils/rating.util';
import { Product } from '../../models/product.model';
import { SnackbarService } from '../../services/snackbar.service';
import { ProductService } from '../../services/product.service';
import { CategoryLabelPipe } from '../../pipes/category-label.pipe';
import { Loader } from '../../components/loader/loader';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, CategoryLabelPipe, Loader],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.css',
})
export class WishlistPage {
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private snackBar = inject(SnackbarService);

  private loaderService = inject(LoaderService); // ← inject service

  isLoading = this.loaderService.isLoading;

  wishlistItems = this.wishlistService.getWishlistSignal;
  wishlistCount = computed(() => this.wishlistItems().length);

  constructor() {
    this.loaderService.show(); // ← show on init
    afterNextRender(() => {
      this.loaderService.hide(); // ← hide after render
    });
  }

  getRating() {
    return Rating;
  }

  getDiscountPrice(item: Product): number {
    return this.productService.getDiscountPrice(item);
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();

    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id!);
    this.snackBar.success('Moved to cart');
  }

  removeFromWishlist(productId: string, event: Event) {
    event.stopPropagation();
    this.wishlistService.removeFromWishlist(productId);
    this.snackBar.success('Remove to wishlist');
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }
}
