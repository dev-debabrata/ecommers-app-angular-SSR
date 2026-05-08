import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';
import { User } from '../../../models/user.model';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  user = signal<User | null>(null);
  orders = signal<Order[]>([]);
  errorMsg = false;
  activeSection: string = 'profile';

  ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('id');
    if (!uid) return;

    const userSub = this.userService.getUserById(uid).subscribe({
      next: (userData) => {
        this.user.set(userData);
      },

      error: (err) => {
        console.log('User fetch error: ', err);
        this.errorMsg = true;
      },
    });

    const orderSub = this.orderService.getUserOrders(uid).subscribe({
      next: (res) => {
        this.orders.set(res);
      },

      error: (err) => {
        console.log('Orders fetch error: ', err);
        this.errorMsg = true;
      },
    });

    this.destroyRef.onDestroy(() => {
      userSub.unsubscribe();
      orderSub.unsubscribe();
    });
  }
}
