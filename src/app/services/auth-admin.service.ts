import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(Injector);

  firebaseUser$: Observable<FirebaseUser | null> = runInInjectionContext(this.injector, () =>
    authState(this.auth),
  );

  loginAdmin(email: string, password: string) {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(async (result) => {
        const uid = result.user.uid;
        const adminRef = doc(this.firestore, 'users/' + uid);
        const snap = await getDoc(adminRef);

        if (!snap.exists()) {
          await signOut(this.auth);
          throw new Error('Admin not found');
        }

        const role = snap.data()?.['role'];
        if (role !== 'admin') {
          await signOut(this.auth);
          throw new Error('Unauthorized');
        }

        return result.user;
      }),
    );
  }

  logout() {
    return from(
      signOut(this.auth).then(() => {
        this.router.navigateByUrl('/admin/login', { replaceUrl: true });
      }),
    );
  }

  isAdmin$ = this.firebaseUser$.pipe(
    switchMap((user) => {
      if (!user) return of(false);

      const adminRef = doc(this.firestore, 'users/' + user.uid);

      return from(getDoc(adminRef)).pipe(
        map((snap) => {
          if (!snap.exists()) return false;
          return snap.data()?.['role'] === 'admin';
        }),
      );
    }),
  );
}
