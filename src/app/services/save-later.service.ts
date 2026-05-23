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

    const ref = collection(this.firestore, `users/${uid}/savedLater`);

    runInInjectionContext(this.injector, () => collectionData(ref)).subscribe((items: any) => {
      const updated = items.map((item: any) => ({
        ...item,
        quantity: item.quantity ?? 1,
        discount: item.discount ?? 0,
        subCategory: item.subCategory ?? '',
      }));
      this.savedLater.set(updated);
    });
  }

  saveForLater(item: CartItem) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.savedLater.update((items) => [...items, item]);
    from(setDoc(doc(this.firestore, `users/${uid}/savedLater/${item.id}`), item)).subscribe();
  }

  moveToCart(item: CartItem) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.savedLater.update((items) => items.filter((i) => i.id !== item.id));
    from(deleteDoc(doc(this.firestore, `users/${uid}/savedLater/${item.id}`))).subscribe();
  }

  removeFromSaved(id: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.savedLater.update((items) => items.filter((i) => i.id !== id));
    from(deleteDoc(doc(this.firestore, `users/${uid}/savedLater/${id}`))).subscribe();
  }
}
