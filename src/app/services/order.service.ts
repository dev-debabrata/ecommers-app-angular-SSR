import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDoc,
  query,
  orderBy,
  updateDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, forkJoin, from, map, switchMap } from 'rxjs';
import { Order, OrderItem } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private firestore = inject(Firestore);

  getDiscountPrice(item: OrderItem): number {
    const discount = item.discount ?? 0;
    return item.price - (item.price * discount) / 100;
  }

  createOrder(userId: string, order: Order): Observable<Order> {
    const orderId = doc(collection(this.firestore, 'orders')).id;

    const fullOrder: Order = {
      ...order,
      id: orderId,
      userId,
      createdAt: Date.now(),
      status: 'pending',
    };

    const userOrderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);
    const globalOrderRef = doc(this.firestore, `orders/${orderId}`);

    return from(setDoc(userOrderRef, fullOrder)).pipe(
      switchMap(() => from(setDoc(globalOrderRef, fullOrder))),
      map(() => fullOrder),
    );
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, `users/${userId}/orders`);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  getOrderById(userId: string, orderId: string): Observable<Order | null> {
    const orderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);

    return from(getDoc(orderRef)).pipe(
      map((snap) => {
        if (!snap.exists()) return null;

        return {
          id: snap.id,
          ...snap.data(),
        } as Order;
      }),
    );
  }

  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  updateOrderStatus(
    userId: string,
    userOrderId: string,
    globalOrderId: string,
    status: Order['status'],
  ) {
    const userOrderRef = doc(this.firestore, `users/${userId}/orders/${userOrderId}`);
    const globalOrderRef = doc(this.firestore, `orders/${globalOrderId}`);

    return forkJoin([
      from(updateDoc(userOrderRef, { status })),
      from(updateDoc(globalOrderRef, { status })),
    ]);
  }
}

// import { Injectable, inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import {
//   Firestore,
//   collection,
//   collectionData,
//   doc,
//   getDoc,
//   query,
//   orderBy,
//   updateDoc,
//   setDoc,
// } from '@angular/fire/firestore';
// import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
// import { Order, OrderItem } from '../models/order.model';

// @Injectable({ providedIn: 'root' })
// export class OrderService {
//   private platformId = inject(PLATFORM_ID);
//   private isBrowser = isPlatformBrowser(this.platformId);

//   //  Only inject Firestore in browser
//   private firestore = this.isBrowser ? inject(Firestore) : null;

//   getDiscountPrice(item: OrderItem): number {
//     const discount = item.discount ?? 0;
//     return item.price - (item.price * discount) / 100;
//   }

//   createOrder(userId: string, order: Order): Observable<Order> {
//     if (!this.isBrowser || !this.firestore) return of({} as Order);

//     const orderId = doc(collection(this.firestore, 'orders')).id;
//     const fullOrder: Order = {
//       ...order,
//       id: orderId,
//       userId,
//       createdAt: Date.now(),
//       status: 'pending',
//     };

//     const userOrderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);
//     const globalOrderRef = doc(this.firestore, `orders/${orderId}`);

//     return from(setDoc(userOrderRef, fullOrder)).pipe(
//       switchMap(() => from(setDoc(globalOrderRef, fullOrder))),
//       map(() => fullOrder),
//     );
//   }

//   getUserOrders(userId: string): Observable<Order[]> {
//     if (!this.isBrowser || !this.firestore) return of([]);

//     const ordersRef = collection(this.firestore, `users/${userId}/orders`);
//     const q = query(ordersRef, orderBy('createdAt', 'desc'));
//     return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
//   }

//   getOrderById(userId: string, orderId: string): Observable<Order | null> {
//     if (!this.isBrowser || !this.firestore) return of(null);

//     const orderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);
//     return from(getDoc(orderRef)).pipe(
//       map((snap) => {
//         if (!snap.exists()) return null;
//         return { id: snap.id, ...snap.data() } as Order;
//       }),
//     );
//   }

//   getAllOrders(): Observable<Order[]> {
//     if (!this.isBrowser || !this.firestore) return of([]);

//     const ordersRef = collection(this.firestore, 'orders');
//     const q = query(ordersRef, orderBy('createdAt', 'desc'));
//     return collectionData(q, { idField: 'id' }) as Observable<any[]>;
//   }

//   updateOrderStatus(
//     userId: string,
//     userOrderId: string,
//     globalOrderId: string,
//     status: Order['status'],
//   ): Observable<any> {
//     if (!this.isBrowser || !this.firestore) return of(null);

//     const userOrderRef = doc(this.firestore, `users/${userId}/orders/${userOrderId}`);
//     const globalOrderRef = doc(this.firestore, `orders/${globalOrderId}`);

//     return forkJoin([
//       from(updateDoc(userOrderRef, { status })),
//       from(updateDoc(globalOrderRef, { status })),
//     ]);
//   }
// }
