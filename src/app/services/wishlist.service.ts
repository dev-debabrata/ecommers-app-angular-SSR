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
import { from, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private wishlistSub: any = null;
  private wishlist = signal<Product[]>([]);

  itemCount = computed(() => this.wishlist().length);
  getWishlistSignal = this.wishlist.asReadonly();

  constructor() {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.loadWishlist();
      } else {
        this.wishlist.set([]);
      }
    });
  }

  loadWishlist() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }

    const wishlistRef = collection(this.firestore, `users/${uid}/wishlist`);

    collectionData(wishlistRef, { idField: 'id' }).subscribe((items: any[]) => {
      const sorted = (items || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.wishlist.set(sorted);
    });
  }

  addToWishlist(product: Product): Observable<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return of(void 0);

    const exists = this.isInWishlist(product.id);
    if (exists) return of(void 0);

    const item = {
      ...product,
      createdAt: Date.now(),
    };

    this.wishlist.update((items) => [item, ...items]);

    return from(setDoc(doc(this.firestore, `users/${uid}/wishlist/${product.id}`), item));
  }

  removeFromWishlist(id: string): void {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.wishlist.update((items) => items.filter((p) => p.id !== id));

    deleteDoc(doc(this.firestore, `users/${uid}/wishlist/${id}`)).catch((err) => {
      console.error('Delete failed:', err);
    });
  }

  isInWishlist(id: string | undefined): boolean {
    if (!id) return false;
    return this.wishlist().some((p) => p.id === id);
  }

  // isInWishlist(id: string): boolean {
  //   return this.wishlist().some((p) => p.id === id);
  // }
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
// import { from, Observable, of } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class WishlistService {
//   private platformId = inject(PLATFORM_ID);
//   private isBrowser = isPlatformBrowser(this.platformId);

//   //  Only inject Firebase in browser
//   private firestore = this.isBrowser ? inject(Firestore) : null;
//   private auth = this.isBrowser ? inject(Auth) : null;

//   private wishlistSub: any = null;
//   private wishlist = signal<Product[]>([]);

//   itemCount = computed(() => this.wishlist().length);
//   getWishlistSignal = this.wishlist.asReadonly();

//   constructor() {
//     //  Only subscribe in browser
//     if (!this.isBrowser || !this.auth) return;

//     authState(this.auth).subscribe((user) => {
//       if (user) {
//         this.loadWishlist();
//       } else {
//         this.wishlist.set([]);
//       }
//     });
//   }

//   loadWishlist() {
//     if (!this.isBrowser || !this.auth || !this.firestore) return;

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return;

//     if (this.wishlistSub) {
//       this.wishlistSub.unsubscribe();
//     }

//     const wishlistRef = collection(this.firestore, `users/${uid}/wishlist`);

//     this.wishlistSub = collectionData(wishlistRef, { idField: 'id' }).subscribe((items: any[]) => {
//       const sorted = (items || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
//       this.wishlist.set(sorted);
//     });
//   }

//   addToWishlist(product: Product): Observable<void> {
//     if (!this.isBrowser || !this.auth || !this.firestore) return of(void 0);

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return of(void 0);

//     const exists = this.isInWishlist(product.id);
//     if (exists) return of(void 0);

//     const item = { ...product, createdAt: Date.now() };

//     this.wishlist.update((items) => [item, ...items]);

//     return from(setDoc(doc(this.firestore, `users/${uid}/wishlist/${product.id}`), item));
//   }

//   removeFromWishlist(id: string): void {
//     if (!this.isBrowser || !this.auth || !this.firestore) return;

//     const uid = this.auth.currentUser?.uid;
//     if (!uid) return;

//     this.wishlist.update((items) => items.filter((p) => p.id !== id));

//     deleteDoc(doc(this.firestore, `users/${uid}/wishlist/${id}`)).catch((err) => {
//       console.error('Delete failed:', err);
//     });
//   }

//   isInWishlist(id: string | undefined): boolean {
//     if (!id) return false;
//     return this.wishlist().some((p) => p.id === id);
//   }
// }
