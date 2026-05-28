import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { from } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class SaveLaterService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);

  savedLater = signal<CartItem[]>([]);

  constructor() {
    runInInjectionContext(this.injector, () => authState(this.auth)).subscribe((user) => {
      if (user) {
        this.loadSavedLater();
      } else {
        this.savedLater.set([]);
      }
    });
  }

  loadSavedLater() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, `users/${uid}/savedLater`);
      return collectionData(ref);
    }).subscribe((items: any) => {
      const updated = items
        .map((item: any) => ({
          ...item,
          quantity: item.quantity ?? 1,
          discount: item.discount ?? 0,
          subCategory: item.subCategory ?? '',
        }))
        .sort((a: CartItem, b: CartItem) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      this.savedLater.set(updated);
    });
  }

  saveForLater(item: CartItem) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    const savedItem = { ...item, createdAt: Date.now() };

    this.savedLater.update((items) =>
      [...items, savedItem].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)),
    );

    runInInjectionContext(this.injector, () => {
      setDoc(doc(this.firestore, `users/${uid}/savedLater/${item.id}`), savedItem);
    });

    // from(setDoc(doc(this.firestore, `users/${uid}/savedLater/${item.id}`), savedItem)).subscribe();
    // this.savedLater.update((items) => [...items, savedItem]);
    // from(setDoc(doc(this.firestore, `users/${uid}/savedLater/${item.id}`), item)).subscribe();
  }

  moveToCart(item: CartItem) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.savedLater.update((items) => items.filter((i) => i.id !== item.id));
    runInInjectionContext(this.injector, () => {
      deleteDoc(doc(this.firestore, `users/${uid}/savedLater/${item.id}`));
    });
    // from(deleteDoc(doc(this.firestore, `users/${uid}/savedLater/${item.id}`))).subscribe();
  }

  removeFromSaved(id: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.savedLater.update((items) => items.filter((i) => i.id !== id));
    runInInjectionContext(this.injector, () => {
      deleteDoc(doc(this.firestore, `users/${uid}/savedLater/${id}`));
    });
    // from(deleteDoc(doc(this.firestore, `users/${uid}/savedLater/${id}`))).subscribe();
  }
}
