// import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import {
//   Auth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   updateProfile,
//   authState,
//   User as FirebaseUser,
// } from '@angular/fire/auth';
// import { Firestore, doc, docData, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';
// import { from, Observable, of, switchMap } from 'rxjs';
// import { User } from '../models/user.model';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private platformId = inject(PLATFORM_ID);
//   private isBrowser = isPlatformBrowser(this.platformId);

//   //  Only inject Firebase when in browser
//   private auth = this.isBrowser ? inject(Auth) : null;
//   private firestore = this.isBrowser ? inject(Firestore) : null;

//   //  Safe — of(null) on server
//   firebaseUser$: Observable<FirebaseUser | null> =
//     this.isBrowser && this.auth ? authState(this.auth) : of(null);

//   currentUser = signal<FirebaseUser | null>(null);
//   isAuthReady = signal(false);

//   constructor() {
//     if (this.isBrowser) {
//       //  Only subscribe in browser
//       this.firebaseUser$.subscribe((user) => {
//         this.currentUser.set(user);
//         this.isAuthReady.set(true);
//       });
//     } else {
//       //  Mark ready immediately on server
//       this.isAuthReady.set(true);
//     }
//   }

//   signupUser(data: User, password: string): Observable<any> {
//     if (!this.isBrowser || !this.auth || !this.firestore) return of(null);

//     return from(
//       createUserWithEmailAndPassword(this.auth, data.email, password).then((result) => {
//         const uid = result.user.uid;
//         return updateProfile(result.user, {
//           displayName: `${data.firstName} ${data.lastName}`,
//         }).then(() => {
//           return setDoc(doc(this.firestore!, 'users/' + uid), {
//             ...data,
//             uid,
//             role: 'user',
//             createdAt: serverTimestamp(),
//           }).then(() => result.user);
//         });
//       }),
//     );
//   }

//   login(email: string, password: string): Observable<any> {
//     if (!this.isBrowser || !this.auth || !this.firestore) return of(null);

//     return from(
//       signInWithEmailAndPassword(this.auth, email, password).then(async (res) => {
//         const uid = res.user.uid;
//         const userRef = doc(this.firestore!, 'users/' + uid);
//         const snap = await getDoc(userRef);

//         if (!snap.exists()) {
//           await signOut(this.auth!);
//           throw new Error('User not found');
//         }

//         const role = snap.data()?.['role'];
//         if (role !== 'user') {
//           await signOut(this.auth!);
//           throw new Error('Unauthorized');
//         }

//         return res.user;
//       }),
//     );
//   }

//   logout(): Observable<void> {
//     if (!this.isBrowser || !this.auth) return of(undefined);
//     return from(signOut(this.auth));
//   }

//   isLoggedIn(): boolean {
//     //  navigator guard
//     if (!this.isBrowser) return false;
//     return this.isAuthReady() && !!this.currentUser() && navigator.onLine;
//   }

//   getFullUser(): Observable<User | null> {
//     if (!this.isBrowser || !this.firestore) return of(null);

//     return this.firebaseUser$.pipe(
//       switchMap((fbUser) => {
//         if (!fbUser) return of(null);
//         const userRef = doc(this.firestore!, 'users/' + fbUser.uid);
//         return docData(userRef, { idField: 'uid' }) as Observable<User | null>;
//       }),
//     );
//   }
// }

import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  authState,
  User as FirebaseUser,
} from '@angular/fire/auth';

import { Firestore, doc, docData, getDoc, serverTimestamp, setDoc } from '@angular/fire/firestore';

import { from, Observable, of, switchMap } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  firebaseUser$: Observable<FirebaseUser | null> = authState(this.auth);
  currentUser = signal<FirebaseUser | null>(null);
  isAuthReady = signal(false);

  constructor() {
    this.firebaseUser$.subscribe((user) => {
      this.currentUser.set(user);
      this.isAuthReady.set(true);
    });
  }

  signupUser(data: User, password: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, data.email, password).then((result) => {
        const uid = result.user.uid;

        return updateProfile(result.user, {
          displayName: `${data.firstName} ${data.lastName}`,
        }).then(() => {
          return setDoc(doc(this.firestore, 'users/' + uid), {
            ...data,
            uid,
            role: 'user',
            createdAt: serverTimestamp(),
          }).then(() => result.user);
        });
      }),
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async (res) => {
        const uid = res.user.uid;

        const userRef = doc(this.firestore, 'users/' + uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await signOut(this.auth);
          throw new Error('User not found');
        }

        const role = snap.data()?.['role'];

        if (role !== 'user') {
          await signOut(this.auth);
          throw new Error('Unauthorized');
        }

        return res.user;
      }),
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  isLoggedIn(): boolean {
    return this.isAuthReady() && !!this.currentUser() && navigator.onLine;
  }

  getFullUser(): Observable<User | null> {
    return this.firebaseUser$.pipe(
      switchMap((fbUser) => {
        if (!fbUser) return of(null);

        const userRef = doc(this.firestore, 'users/' + fbUser.uid);
        return docData(userRef, { idField: 'uid' }) as Observable<User | null>;

        //  return from(
        //     getDoc(userRef).then((snap) => {
        //       return snap.exists() ? (snap.data() as User) : null;
        //  }),
      }),
    );
  }
}
