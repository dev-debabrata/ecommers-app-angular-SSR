import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-footwear',
  standalone: true,
  imports: [],
  templateUrl: './footwear.html',
  styleUrl: './footwear.css',
})
export class Footwear implements OnInit {
  private protectService = inject(ProductService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @Input() category: string = 'footwear';

  products = signal<Product[]>([]);

  ngOnInit(): void {
    const productSub = this.protectService.getProductsByCategory(this.category).subscribe({
      next: (res: Product[]) => {
        this.products.set(res.slice(0, 4));
        console.log(res);
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
}
