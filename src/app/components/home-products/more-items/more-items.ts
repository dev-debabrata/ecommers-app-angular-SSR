import {
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-more-items',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './more-items.html',
  styleUrl: './more-items.css',
})
export class MoreItems implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  // private platformId = inject(PLATFORM_ID);

  @Input() totalLimit = 24;

  pageSize = 8;
  products = signal<Product[]>([]);
  currentIndex = signal(0);

  fullProducts = computed(() => {
    return this.products().slice(0, this.totalLimit);
  });

  limitedProducts = computed(() => {
    const start = this.currentIndex();
    const end = start + this.pageSize;

    return this.fullProducts().slice(start, end);
  });

  ngOnInit() {
    // if (!isPlatformBrowser(this.platformId)) return;

    const sub = this.productService.getProducts().subscribe((res: Product[]) => {
      const sorted = [...res].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

      this.products.set(sorted);
    });

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
  }

  next() {
    const maxIndex = this.fullProducts().length - this.pageSize;

    if (this.currentIndex() < maxIndex) {
      this.currentIndex.set(this.currentIndex() + this.pageSize);
    }
  }

  prev() {
    if (this.currentIndex() > 0) {
      this.currentIndex.set(this.currentIndex() - this.pageSize);
    }
  }

  viewDetails(id: string) {
    this.router.navigate(['/products', id]);
  }
}
