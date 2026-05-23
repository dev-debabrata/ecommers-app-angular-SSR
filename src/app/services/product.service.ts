import { inject, Injectable, Injector, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  deleteDoc,
  updateDoc,
  docData,
} from '@angular/fire/firestore';
import { EMPTY, from, map, Observable } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore = inject(Firestore);
  private platformId = inject(PLATFORM_ID);
  private injector = inject(Injector);

  getDiscountPrice(product: Product): number {
    if (!product.discount) return product.price;
    return product.price - (product.price * product.discount) / 100;
  }

  getProducts(): Observable<Product[]> {
    if (!isPlatformBrowser(this.platformId)) return EMPTY;
    const ref = collection(this.firestore, 'products');

    return runInInjectionContext(this.injector, () =>
      collectionData(ref, { idField: 'id' }),
    ) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product | null> {
    const productRef = doc(this.firestore, 'products/' + id);
    return runInInjectionContext(this.injector, () =>
      docData(productRef, { idField: 'id' }),
    ) as Observable<Product | null>;
  }

  // private firestore = inject(Firestore);
  // private platformId = inject(PLATFORM_ID);
  // // private productsRef = collection(this.firestore, 'products');

  // getDiscountPrice(product: Product): number {
  //   if (!product.discount) return product.price;

  //   return product.price - (product.price * product.discount) / 100;
  // }

  // getProducts(): Observable<Product[]> {
  //   if (!isPlatformBrowser(this.platformId)) return EMPTY;
  //   const ref = collection(this.firestore, 'products');
  //   return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
  // }

  // // getProducts(): Observable<Product[]> {
  // //   return collectionData(this.productsRef, {
  // //     idField: 'id',
  // //   }) as Observable<Product[]>;
  // // }

  // getProductById(id: string): Observable<Product | null> {
  //   const productRef = doc(this.firestore, 'products/' + id);

  //   return docData(productRef, {
  //     idField: 'id',
  //   }) as Observable<Product | null>;
  // }

  addProduct(product: Product): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return EMPTY;
    const ref = collection(this.firestore, 'products');
    return from(addDoc(ref, { ...product, createdAt: Date.now() }));
  }

  deleteProduct(id: string): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) return EMPTY;
    return from(deleteDoc(doc(this.firestore, 'products/' + id)));
  }

  updateProduct(id: string, data: Partial<Product>): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) return EMPTY;
    return from(updateDoc(doc(this.firestore, 'products/' + id), data));
  }

  // addProduct(product: Product): Observable<any> {
  //   return from(
  //     addDoc(this.productsRef, {
  //       ...product,
  //       createdAt: Date.now(),
  //     }),
  //   );
  // }

  // deleteProduct(id: string): Observable<void> {
  //   const productRef = doc(this.firestore, 'products/' + id);
  //   return from(deleteDoc(productRef));
  // }

  // updateProduct(id: string, data: Partial<Product>): Observable<void> {
  //   const productRef = doc(this.firestore, 'products/' + id);
  //   return from(updateDoc(productRef, data));
  // }

  ///////////////////////////////////////////////////////////////////////////////////
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) => {
        const cat = category.toLowerCase().trim();

        return products
          .filter((p) => {
            if (cat === 'all') return true;

            const matchesMain = p.category?.toLowerCase().trim() === cat;
            const matchesSub = p.subCategory?.toLowerCase().trim() === cat;

            return matchesMain || matchesSub;

            // return p.category?.toLowerCase().trim() === cat;
          })
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }),
    );
  }

  getTrendingProducts(): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) => products.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))),
    );
  }

  getTodayDeals(): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products
          .filter((p) => (p.discount || 0) >= 70)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      ),
    );
  }

  getDiscountProducts(): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products
          .filter((p) => (p.discount || 0) >= 50)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
      ),
    );
  }
}

// import { inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import {
//   Firestore,
//   collection,
//   addDoc,
//   collectionData,
//   doc,
//   deleteDoc,
//   updateDoc,
//   docData,
// } from '@angular/fire/firestore';
// import { EMPTY, from, map, Observable, of } from 'rxjs';
// import { Product } from '../models/product.model';

// @Injectable({ providedIn: 'root' })
// export class ProductService {
//   private platformId = inject(PLATFORM_ID);
//   private isBrowser = isPlatformBrowser(this.platformId);

//   private firestore = this.isBrowser ? inject(Firestore) : null;

//   getDiscountPrice(product: Product): number {
//     if (!product.discount) return product.price;
//     return product.price - (product.price * product.discount) / 100;
//   }

//   getProducts(): Observable<Product[]> {
//     if (!this.isBrowser || !this.firestore) return of([]);
//     const ref = collection(this.firestore, 'products');
//     return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
//   }

//   getProductById(id: string): Observable<Product | null> {
//     if (!this.isBrowser || !this.firestore) return of(null);
//     const productRef = doc(this.firestore, 'products/' + id);
//     return docData(productRef, { idField: 'id' }) as Observable<Product | null>;
//   }

//   addProduct(product: Product): Observable<any> {
//     if (!this.isBrowser || !this.firestore) return EMPTY;
//     const ref = collection(this.firestore, 'products');
//     return from(addDoc(ref, { ...product, createdAt: Date.now() }));
//   }

//   deleteProduct(id: string): Observable<void> {
//     if (!this.isBrowser || !this.firestore) return EMPTY;
//     return from(deleteDoc(doc(this.firestore, 'products/' + id)));
//   }

//   updateProduct(id: string, data: Partial<Product>): Observable<void> {
//     if (!this.isBrowser || !this.firestore) return EMPTY;
//     return from(updateDoc(doc(this.firestore, 'products/' + id), data));
//   }

//   getProductsByCategory(category: string): Observable<Product[]> {
//     return this.getProducts().pipe(
//       map((products) => {
//         const cat = category.toLowerCase().trim();
//         return products
//           .filter((p) => {
//             if (cat === 'all') return true;
//             const matchesMain = p.category?.toLowerCase().trim() === cat;
//             const matchesSub = p.subCategory?.toLowerCase().trim() === cat;
//             return matchesMain || matchesSub;
//           })
//           .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
//       }),
//     );
//   }

//   getTrendingProducts(): Observable<Product[]> {
//     return this.getProducts().pipe(
//       map((products) =>
//         products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 10),
//       ),
//     );
//   }

//   getTodayDeals(): Observable<Product[]> {
//     return this.getProducts().pipe(
//       map((products) =>
//         products
//           .filter((p) => (p.discount || 0) > 0)
//           .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
//       ),
//     );
//   }

//   getDiscountProducts(): Observable<Product[]> {
//     return this.getProducts().pipe(
//       map((products) =>
//         products
//           .filter((p) => (p.discount || 0) >= 50)
//           .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
//       ),
//     );
//   }
// }
