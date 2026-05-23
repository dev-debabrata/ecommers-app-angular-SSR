import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
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
  private injector = inject(Injector);

  getDiscountPrice(item: OrderItem): number {
    const discount = item.discount ?? 0;
    return item.price - (item.price * discount) / 100;
  }

  createOrder(userId: string, order: Order): Observable<Order> {
    const orderId = doc(collection(this.firestore, 'orders')).id;

    const fullOrder: Order = {
      ...order,
      orderId,
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

    return runInInjectionContext(this.injector, () =>
      collectionData(q, { idField: 'id' }),
    ) as Observable<Order[]>;
  }

  getOrderById(userId: string, orderId: string): Observable<Order | null> {
    const orderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);

    return runInInjectionContext(this.injector, () => from(getDoc(orderRef))).pipe(
      map((snap) => {
        if (!snap.exists()) return null;
        return { orderId: snap.id, ...snap.data() } as Order;
      }),
    );
  }

  // getOrderById(userId: string, orderId: string): Observable<Order | null> {
  //   const orderRef = doc(this.firestore, `users/${userId}/orders/${orderId}`);

  //   return from(getDoc(orderRef)).pipe(
  //     map((snap) => {
  //       if (!snap.exists()) return null;
  //       return { orderId: snap.id, ...snap.data() } as Order;
  //     }),
  //   );
  // }

  getAllOrders(): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return runInInjectionContext(this.injector, () =>
      collectionData(q, { idField: 'id' }),
    ) as Observable<any[]>;
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
