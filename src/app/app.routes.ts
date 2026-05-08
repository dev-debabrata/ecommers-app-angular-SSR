import { Routes } from '@angular/router';

import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/auth/login-page/login-page';
import { SignupPage } from './pages/auth/signup-page/signup-page';
import { NotFound } from './components/not-found/not-found';
import { ProductListPage } from './pages/products/product-list-page/product-list-page';
import { CartPage } from './pages/cart-page/cart-page';
import { authGuard } from './guards/auth-guard';
import { AboutPage } from './pages/about-page/about-page';
import { ContactPage } from './pages/contact-page/contact-page';
import { ProfilePage } from './pages/account/profile-page/profile-page';
import { OrderSuccessPage } from './pages/cart-page/checkout/order-success-page/order-success-page';
import { CustomerLayout } from './layouts/customer-layout/customer-layout';

export const routes: Routes = [
  {
    path: '',
    component: CustomerLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },

      {
        path: 'account',
        component: ProfilePage,
        canActivate: [authGuard],
        data: { breadcrumb: 'Profile' },
      },

      {
        path: 'about',
        component: AboutPage,
        data: { breadcrumb: 'About' },
      },

      {
        path: 'contact',
        component: ContactPage,
        data: { breadcrumb: 'Contact' },
      },

      {
        path: 'login',
        canActivate: [authGuard],
        component: LoginPage,
        data: { hideLayout: true },
      },

      {
        path: 'signup',
        component: SignupPage,
        canActivate: [authGuard],
        data: { hideLayout: true },
      },

      {
        path: 'products',
        // data: { breadcrumb: 'Products' },
        children: [
          {
            path: '',
            component: ProductListPage,
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/products/product-detail-page/product-detail-page').then(
                (m) => m.ProductDetailPage,
              ),
          },
        ],
      },

      {
        path: 'cart',
        canActivate: [authGuard],
        data: { breadcrumb: 'Cart' },
        children: [
          {
            path: '',
            component: CartPage,
          },
          {
            path: 'checkout',
            loadComponent: () =>
              import('./pages/cart-page/checkout/checkout-page/checkout-page').then(
                (m) => m.CheckoutPage,
              ),
            data: { breadcrumb: 'Checkout' },
          },
        ],
      },

      {
        path: 'wishlist',
        loadComponent: () =>
          import('./pages/wishlist-page/wishlist-page').then((m) => m.WishlistPage),
        canActivate: [authGuard],
        data: { breadcrumb: 'Wishlist' },
      },

      {
        path: 'order-success/:id',
        component: OrderSuccessPage,
        canActivate: [authGuard],
        data: { breadcrumb: 'Order Success' },
      },
    ],
  },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },

  {
    path: '**',
    component: NotFound,
    data: { hideLayout: true, hideBreadcrumb: true },
  },
];
