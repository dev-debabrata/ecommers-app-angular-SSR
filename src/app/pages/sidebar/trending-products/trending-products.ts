import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { CategoryLabelPipe } from '../../../pipes/category-label.pipe';
import { Highlight } from '../../../directives/highlight';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { AuthService } from '../../../services/auth-user.service';
import { WishlistService } from '../../../services/wishlist.service';
import { Rating } from '../../../utils/rating.util';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, TruncatePipe, CategoryLabelPipe, Highlight],
  templateUrl: './trending-products.html',
  styleUrl: './trending-products.css',
})
export class TrendingProducts implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(SnackbarService);

  products = signal<Product[]>([]);
  @Input() showWishlistIcon = true;
  // showWishlistIcon = true;

  ngOnInit(): void {
    const productSub = this.productService.getTrendingProducts().subscribe({
      next: (res) => {
        this.products.set(res.slice(0, 20));
        console.log();
      },

      error: (err) => {
        console.log(err);
      },
    });

    this.destroyRef.onDestroy(() => {
      productSub.unsubscribe();
    });
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }

  isWishlisted(productId: string): boolean {
    return this.authService.isLoggedIn() && this.wishlistService.isInWishlist(productId);
  }

  addToWishlist(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.wishlistService.isInWishlist(product.id!)) {
      this.wishlistService.removeFromWishlist(product.id!);
      this.snackBar.error('Removed from wishlist');
    } else {
      this.wishlistService.addToWishlist(product);
      this.snackBar.success('Added to wishlist');
    }
  }

  getRating() {
    return Rating;
  }

  getDiscountPrice(item: Product): number {
    return this.productService.getDiscountPrice(item);
  }
}
