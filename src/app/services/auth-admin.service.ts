import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // ✅ Only inject Firebase in browser
  private auth = this.isBrowser ? inject(Auth) : null;
  private firestore = this.isBrowser ? inject(Firestore) : null;
  private router = inject(Router);

  // ✅ Explicit type fixes the union type error
  firebaseUser$: Observable<FirebaseUser | null> =
    this.isBrowser && this.auth ? authState(this.auth) : of(null);

  // ✅ Explicit type fixes "not callable" error
  isAdmin$: Observable<boolean> = this.isBrowser
    ? this.firebaseUser$.pipe(
        switchMap((user) => {
          if (!user || !this.firestore) return of(false);
          const adminRef = doc(this.firestore, 'users/' + user.uid);
          return from(getDoc(adminRef)).pipe(
            map((snap) => {
              if (!snap.exists()) return false;
              return snap.data()?.['role'] === 'admin';
            }),
          );
        }),
      )
    : of(false);

  loginAdmin(email: string, password: string): Observable<any> {
    if (!this.isBrowser || !this.auth || !this.firestore) return of(null);

    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async (result) => {
        const uid = result.user.uid;
        const adminRef = doc(this.firestore!, 'users/' + uid);
        const snap = await getDoc(adminRef);

        if (!snap.exists()) {
          await signOut(this.auth!);
          throw new Error('Admin not found');
        }

        const role = snap.data()?.['role'];
        if (role !== 'admin') {
          await signOut(this.auth!);
          throw new Error('Unauthorized');
        }

        return result.user;
      }),
    );
  }

  logout(): Observable<any> {
    if (!this.isBrowser || !this.auth) return of(null);

    return from(
      signOut(this.auth).then(() => {
        this.router.navigateByUrl('/admin/login', { replaceUrl: true });
      }),
    );
  }
}

// import { Injectable, inject } from '@angular/core';
// import {
//   Auth,
//   signInWithEmailAndPassword,
//   signOut,
//   authState,
//   User as FirebaseUser,
// } from '@angular/fire/auth';

// import { Firestore, doc, getDoc } from '@angular/fire/firestore';
// import { Router } from '@angular/router';
// import { from, map, Observable, of, switchMap } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AdminAuthService {
//   private auth = inject(Auth);
//   private firestore = inject(Firestore);
//   private router = inject(Router);

//   firebaseUser$: Observable<FirebaseUser | null> = authState(this.auth);

//   loginAdmin(email: string, password: string) {
//     return from(
//       signInWithEmailAndPassword(this.auth, email, password).then(async (result) => {
//         const uid = result.user.uid;

//         const adminRef = doc(this.firestore, 'users/' + uid);
//         const snap = await getDoc(adminRef);

//         if (!snap.exists()) {
//           await signOut(this.auth);
//           throw new Error('Admin not found');
//         }

//         const role = snap.data()?.['role'];

//         if (role !== 'admin') {
//           await signOut(this.auth);
//           throw new Error('Unauthorized');
//         }

//         return result.user;
//       }),
//     );
//   }

//   logout() {
//     return from(
//       signOut(this.auth).then(() => {
//         this.router.navigateByUrl('/admin/login', { replaceUrl: true });
//       }),
//     );
//   }

//   isAdmin$ = this.firebaseUser$.pipe(
//     switchMap((user) => {
//       if (!user) return of(false);

//       const adminRef = doc(this.firestore, 'users/' + user.uid);

//       return from(getDoc(adminRef)).pipe(
//         map((snap) => {
//           if (!snap.exists()) return false;
//           return snap.data()?.['role'] === 'admin';
//         }),
//       );
//     }),
//   );

//   // isAdmin$ = this.firebaseUser$;
// }
