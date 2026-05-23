import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AddressUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return runInInjectionContext(this.injector, () =>
      collectionData(usersRef, { idField: 'id' }),
    ) as Observable<User[]>;
  }

  getUserById(uid: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return runInInjectionContext(this.injector, () =>
      docData(userRef, { idField: 'uid' }),
    ) as Observable<User>;
  }

  deleteUser(id: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${id}`);
    return from(deleteDoc(userDoc));
  }

  updateUserAddress(uid: string, data: Partial<User>): Observable<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(updateDoc(userRef, data));
  }

  deleteUserAddress(uid: string, addresses: AddressUser[]): Observable<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return from(updateDoc(userRef, { addresses }));
  }
}
