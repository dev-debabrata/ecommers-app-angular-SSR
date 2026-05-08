import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc,
  getDoc,
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

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }

  getUserById(uid: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef, { idField: 'uid' }) as Observable<User>;
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

// import { Injectable, inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import {
//   Firestore,
//   collection,
//   collectionData,
//   doc,
//   deleteDoc,
//   docData,
//   updateDoc,
// } from '@angular/fire/firestore';
// import { from, Observable, of } from 'rxjs';
// import { AddressUser, User } from '../models/user.model';

// @Injectable({ providedIn: 'root' })
// export class UserService {
//   private platformId = inject(PLATFORM_ID);
//   private isBrowser = isPlatformBrowser(this.platformId);

//   //  Only inject Firestore in browser
//   private firestore = this.isBrowser ? inject(Firestore) : null;

//   getUsers(): Observable<User[]> {
//     if (!this.isBrowser || !this.firestore) return of([]);
//     const usersRef = collection(this.firestore, 'users');
//     return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
//   }

//   getUserById(uid: string): Observable<User | null> {
//     if (!this.isBrowser || !this.firestore) return of(null);
//     const userRef = doc(this.firestore, `users/${uid}`);
//     return docData(userRef, { idField: 'uid' }) as Observable<User>;
//   }

//   deleteUser(id: string): Observable<void> {
//     if (!this.isBrowser || !this.firestore) return of(undefined);
//     const userDoc = doc(this.firestore, `users/${id}`);
//     return from(deleteDoc(userDoc));
//   }

//   updateUserAddress(uid: string, data: Partial<User>): Observable<void> {
//     if (!this.isBrowser || !this.firestore) return of(undefined);
//     const userRef = doc(this.firestore, `users/${uid}`);
//     return from(updateDoc(userRef, data));
//   }

//   deleteUserAddress(uid: string, addresses: AddressUser[]): Observable<void> {
//     if (!this.isBrowser || !this.firestore) return of(undefined);
//     const userRef = doc(this.firestore, `users/${uid}`);
//     return from(updateDoc(userRef, { addresses }));
//   }
// }
