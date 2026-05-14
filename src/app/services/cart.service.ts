import { computed, inject, Injectable, signal } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  cartLoaded = signal(false);
  cart = signal<CartItem[]>([]);
  itemCount = computed(() => this.cart().length);

  totalPrice = computed(() =>
    this.cart().reduce((acc, item) => acc + this.getDiscountPrice(item) * item.quantity, 0),
  );

  // totalPrice = computed(() =>
  //   this.cart().reduce((acc, item) => acc + item.price * item.quantity, 0),
  // );

  constructor() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.loadCart();
      } else {
        this.cart.set([]);
        this.cartLoaded.set(false);
      }
    });
  }

  loadCart() {
    const uid = this.auth.currentUser?.uid;

    if (!uid) return;

    const cartRef = collection(this.firestore, `users/${uid}/cart`);

    collectionData(cartRef).subscribe((items: any) => {
      const updated = items
        .map((item: any) => ({
          ...item,
          quantity: item.quantity ?? 1,
          discount: item.discount ?? 0,
          subCategory: item.subCategory ?? '',
          // category: item.category ?? '',
        }))
        .sort((a: CartItem, b: CartItem) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

      this.cart.set(updated);
      this.cartLoaded.set(true);
      //  const current = this.cart();
      // if (JSON.stringify(current) !== JSON.stringify(updated)) {

      // }
    });
  }

  getDiscountPrice(item: CartItem): number {
    if (!item.discount) return item.price;

    return item.price - (item.price * item.discount) / 100;
  }

  addToCart(product: Product) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    const existing = this.cart().find((i) => i.id === product.id);

    if (existing) {
      const updatedItem = {
        ...existing,
        quantity: existing.quantity + 1,
        price: product.price,
        name: product.title,
        discount: product.discount || 0,
        image: product.image,
        category: product.category,
        subCategory: product.subCategory,
        stock: product.stock,
        createdAt: existing.createdAt || Date.now(),
      };

      this.cart.update((items) => items.map((i) => (i.id === product.id ? updatedItem : i)));

      from(setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), updatedItem)).subscribe();

      return;
    }

    const cartItem: CartItem = {
      id: product.id!,
      name: product.title,
      price: product.price,
      discount: product.discount || 0,
      image: product.image,
      category: product.category,
      subCategory: product.subCategory,
      brand: product.brand,
      stock: product.stock,
      quantity: 1,
      createdAt: Date.now(),
    };

    this.cart.update((items) => [...items, cartItem]);

    from(setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), cartItem)).subscribe();
  }

  removeItem(id: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.cart.update((items) => items.filter((i) => i.id !== id));

    from(deleteDoc(doc(this.firestore, `users/${uid}/cart/${id}`))).subscribe();
  }

  updateQuantity(id: string, qty: number) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    if (qty <= 0) {
      this.removeItem(id);
      return;
    }

    const item = this.cart().find((i) => i.id === id);
    if (!item) return;

    const updatedItem = { ...item, quantity: qty };

    this.cart.update((items) => items.map((i) => (i.id === id ? updatedItem : i)));

    from(setDoc(doc(this.firestore, `users/${uid}/cart/${id}`), updatedItem)).subscribe();
  }

  clearCart() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    const items = this.cart();

    items.forEach((item) => {
      from(deleteDoc(doc(this.firestore, `users/${uid}/cart/${item.id}`))).subscribe();
    });

    this.cart.set([]);
  }
}

// import { computed, inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import {
//   Firestore,
//   collection,
//   collectionData,
//   doc,
//   setDoc,
//   deleteDoc,
// } from '@angular/fire/firestore';
// import { Auth, authState } from '@angular/fire/auth';
// import { Product } from '../models/product.model';
// import { CartItem } from '../models/cart.model';
// import { from, of } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class CartService {
//   private platformId = inject(PLATFORM_ID);
//   private isBrowser = isPlatformBrowser(this.platformId);

//   //  Only inject Firebase in browser
//   private firestore = this.isBrowser ? inject(Firestore) : null;
//   private auth = this.isBrowser ? inject(Auth) : null;

//   cart = signal<CartItem[]>([]);
//   itemCount = computed(() => this.cart().length);

//   totalPrice = computed(() =>
//     this.cart().reduce((acc, item) => acc + this.getDiscountPrice(item) * item.quantity, 0),
//   );

//   constructor() {
//     //  Only subscribe to auth in browser
//     if (!this.isBrowser || !this.auth) return;

//     authState(this.auth).subscribe((user) => {
//       if (user) {
//         this.loadCart();
//       } else {
//         this.cart.set([]);
//       }
//     });
//   }

//   loadCart() {
//     if (!this.isBrowser || !this.auth || !this.firestore) return;

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return;

//     const cartRef = collection(this.firestore, `users/${uid}/cart`);

//     collectionData(cartRef).subscribe((items: any) => {
//       const updated = items
//         .map((item: any) => ({
//           ...item,
//           quantity: item.quantity ?? 1,
//           discount: item.discount ?? 0,
//         }))
//         .sort((a: CartItem, b: CartItem) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

//       this.cart.set(updated);
//     });
//   }

//   getDiscountPrice(item: CartItem): number {
//     if (!item.discount) return item.price;
//     return item.price - (item.price * item.discount) / 100;
//   }

//   addToCart(product: Product) {
//     if (!this.isBrowser || !this.auth || !this.firestore) return;

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return;

//     const existing = this.cart().find((i) => i.id === product.id);

//     if (existing) {
//       const updatedItem = {
//         ...existing,
//         quantity: existing.quantity + 1,
//         price: product.price,
//         name: product.title,
//         discount: product.discount || 0,
//         image: product.image,
//         category: product.category,
//         stock: product.stock,
//         createdAt: existing.createdAt || Date.now(),
//       };

//       this.cart.update((items) => items.map((i) => (i.id === product.id ? updatedItem : i)));
//       from(setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), updatedItem)).subscribe();
//       return;
//     }

//     const cartItem: CartItem = {
//       id: product.id!,
//       name: product.title,
//       price: product.price,
//       discount: product.discount || 0,
//       image: product.image,
//       category: product.category,
//       brand: product.brand,
//       stock: product.stock,
//       quantity: 1,
//       createdAt: Date.now(),
//     };

//     this.cart.update((items) => [...items, cartItem]);
//     from(setDoc(doc(this.firestore, `users/${uid}/cart/${product.id}`), cartItem)).subscribe();
//   }

//   removeItem(id: string) {
//     if (!this.isBrowser || !this.auth || !this.firestore) return;

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return;

//     this.cart.update((items) => items.filter((i) => i.id !== id));
//     from(deleteDoc(doc(this.firestore, `users/${uid}/cart/${id}`))).subscribe();
//   }

//   updateQuantity(id: string, qty: number) {
//     if (!this.isBrowser || !this.auth || !this.firestore) return;

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return;

//     if (qty <= 0) {
//       this.removeItem(id);
//       return;
//     }

//     const item = this.cart().find((i) => i.id === id);
//     if (!item) return;

//     const updatedItem = { ...item, quantity: qty };
//     this.cart.update((items) => items.map((i) => (i.id === id ? updatedItem : i)));
//     from(setDoc(doc(this.firestore, `users/${uid}/cart/${id}`), updatedItem)).subscribe();
//   }

//   clearCart() {
//     if (!this.isBrowser || !this.auth || !this.firestore) return;

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return;

//     this.cart().forEach((item) => {
//       from(deleteDoc(doc(this.firestore!, `users/${uid}/cart/${item.id}`))).subscribe();
//     });

//     this.cart.set([]);
//   }
// }
