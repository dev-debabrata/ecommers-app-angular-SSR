import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Navbar } from '../navbar/navbar';

import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth-user.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    Navbar,
    MatIconModule,
    MatSnackBarModule,
    Breadcrumb,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private el = inject(ElementRef);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  private onOnline = () => {
    this.isOnline = true;
  };
  private onOffline = () => {
    this.isOnline = false;
  };

  @Input() hideBreadcrumb = false;

  isOnline = true;

  itemCount = this.cartService.itemCount;
  wishlistCount = this.wishlistService.itemCount;

  searchTerm = '';
  suggestions: Product[] = [];
  activeIndex = 0;
  showDropdown = false;
  allProducts: Product[] = [];
  showMenu = false;
  openDropdownIndex: number | null = null;

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const clickedInside = this.el.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showDropdown = false;
    }

    // if (!clickedInside) {
    //   this.suggestions = [];
    //   this.activeIndex = 0;
    // }
  }

  get authReady() {
    return this.authService.isAuthReady();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn() && this.isOnline;
  }

  // get isLoggedIn() {
  //   return this.authService.isLoggedIn();
  // }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  logout() {
    this.authService.logout();
    this.showMenu = false;

    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success'],
    });

    this.router.navigate(['/']);
  }

  viewProfile() {
    this.showMenu = false;
    this.router.navigate(['/account']);
  }

  ngOnInit() {
    const sub = this.productService.getProducts().subscribe((products) => {
      this.allProducts = products;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = navigator.onLine;

      window.addEventListener('online', this.onOnline);
      window.addEventListener('offline', this.onOffline);
    }

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();

      if (isPlatformBrowser(this.platformId)) {
        window.removeEventListener('online', this.onOnline);
        window.removeEventListener('offline', this.onOffline);
      }
    });
  }

  // ngOnInit() {
  //   const sub = this.productService.getProducts().subscribe((products) => {
  //     this.allProducts = products;
  //   });

  //   window.addEventListener('online', this.onOnline);
  //   window.addEventListener('offline', this.onOffline);

  //   this.destroyRef.onDestroy(() => {
  //     sub.unsubscribe();
  //     window.removeEventListener('online', this.onOnline);
  //     window.removeEventListener('offline', this.onOffline);
  //   });
  // }

  onInputChange() {
    this.activeIndex = 0;
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.suggestions = [];
      this.showDropdown = false;
      return;
    }

    this.showDropdown = true;
    this.suggestions = this.allProducts
      .filter((p) => {
        return p.searchName?.toLowerCase().includes(term) || p.title.toLowerCase().includes(term);
      })
      .slice(0, 5);
    // this.suggestions = this.allProducts
    //   .filter((p) => p.title.toLowerCase().includes(term))
    //   .slice(0, 5);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.suggestions.length) return;

    if (event.key === 'ArrowDown') {
      this.activeIndex = (this.activeIndex + 1) % this.suggestions.length;
    }

    if (event.key === 'ArrowUp') {
      this.activeIndex = this.activeIndex <= 0 ? this.suggestions.length - 1 : this.activeIndex - 1;
    }

    if (event.key === 'Enter') {
      const product = this.suggestions[this.activeIndex];
      if (product) {
        this.selectProduct(product);
      } else {
        this.searchProduct();
      }
    }
  }

  selectProduct(product: Product) {
    this.searchTerm = '';
    this.suggestions = [];
    this.showDropdown = false;
    this.router.navigate(['/products', product.id]);
  }

  searchProduct() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return;

    const match = this.allProducts.find((p) => {
      return p.searchName?.toLowerCase().includes(term) || p.title.toLowerCase().includes(term);
    });

    // const match = this.allProducts.find((p) => p.title.toLowerCase().includes(term));

    if (match) {
      this.searchTerm = '';
      this.suggestions = [];
      this.showDropdown = false;
      this.router.navigate(['/products', match.id]);
    } else {
      this.snackBar.open('Product not found', 'Close', { duration: 3000 });
    }
  }
}
