import { Routes } from '@angular/router';

import { AdminLayout } from '../layouts/admin-layout/admin-layout';
import { Dashboard } from './dashboard/dashboard';
import { adminAuthGuard } from '../guards/admin-auth-guard';
import { AdminLoginPage } from './auth/admin-login-page/admin-login-page';
import { ProductList } from './products/product-list/product-list';

import { UserList } from './users/user-list/user-list';
import { OrderList } from './orders/order-list/order-list';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: AdminLoginPage,
    canActivate: [adminAuthGuard],
  },

  {
    path: '',
    component: AdminLayout,
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        component: Dashboard,
      },

      {
        path: 'users',
        children: [
          { path: '', component: UserList },
          {
            path: ':id',
            loadComponent: () =>
              import('./users/user-detail/user-detail').then((m) => m.UserDetail),
          },
        ],
      },

      {
        path: 'products',
        children: [
          { path: '', component: ProductList },
          {
            path: 'add-product',
            loadComponent: () =>
              import('./products/add-product/add-product').then((m) => m.AddProduct),
          },

          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./products/add-product/add-product').then((m) => m.AddProduct),
          },
        ],
      },

      {
        path: 'orders',
        children: [
          { path: '', component: OrderList },
          {
            path: ':id',
            loadComponent: () =>
              import('./orders/order-details/order-details').then((m) => m.OrderDetails),
          },
        ],
      },
    ],
  },
];
