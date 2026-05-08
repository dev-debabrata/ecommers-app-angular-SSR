import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth-user.service';
import { OrderService } from '../../../services/order.service';
import { ProfileDetails } from '../profile-details/profile-details';
import { Address } from '../address/address';
import { OrderHistory } from '../order-history/order-history';
import { User } from '../../../models/user.model';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileDetails, Address, OrderHistory],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user: User | null = null;
  orders: Order[] = [];
  activeSection = 'orders';

  ngOnInit() {
    const userSub = this.authService.getFullUser().subscribe({
      next: (user) => {
        this.user = user;

        if (!user?.uid) return;

        const orderSub = this.orderService.getUserOrders(user.uid).subscribe({
          next: (orders) => {
            this.orders = orders.map((o: Order) => ({
              ...o,
            }));
          },
          error: (err) => {
            console.error('Orders error:', err);
          },
        });

        this.destroyRef.onDestroy(() => {
          orderSub.unsubscribe();
        });
      },

      error: (err) => {
        console.error('User error:', err);
      },
    });

    this.destroyRef.onDestroy(() => {
      userSub.unsubscribe();
    });
  }

  changeSection(section: string) {
    this.activeSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
