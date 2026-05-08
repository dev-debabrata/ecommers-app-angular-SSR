import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { Order, OrderItem } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory {
  private router = inject(Router);
  private orderService = inject(OrderService);

  orders = input<Order[]>([]);

  getDiscountPrice(item: OrderItem): number {
    return this.orderService.getDiscountPrice(item);
  }
  viewProductDetails(productId: string) {
    this.router.navigate(['/products', productId]);
  }
}
