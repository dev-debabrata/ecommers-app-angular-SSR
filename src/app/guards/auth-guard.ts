import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { map, take, of } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { AuthService } from '../services/auth-user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);
  const snackBar = inject(SnackbarService);

  if (!isPlatformBrowser(platformId)) {
    return of(true);
  }

  return authService.firebaseUser$.pipe(
    take(1),
    map((user) => {
      const isLoggedIn = authService.isLoggedIn();
      const url = state.url;
      const isAuthPage = url.startsWith('/login') || url.startsWith('/signup');

      if (isLoggedIn && isAuthPage) {
        snackBar.error('You are already logged in');
        return router.createUrlTree(['/']);
      }
      if (!isLoggedIn && isAuthPage) return true;
      if (!isLoggedIn) {
        snackBar.error('Please login first');
        localStorage.setItem('redirectUrl', state.url);
        return router.createUrlTree(['/login']);
      }
      return true;
    }),
  );
};

// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { map, take } from 'rxjs/operators';

// import { SnackbarService } from '../services/snackbar.service';
// import { AuthService } from '../services/auth-user.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const authService = inject(AuthService);
//   const snackBar = inject(SnackbarService);

//   return authService.firebaseUser$.pipe(
//     take(1),
//     map((user) => {
//       const isLoggedIn = authService.isLoggedIn();
//       const url = state.url;

//       const isAuthPage = url.startsWith('/login') || url.startsWith('/signup');

//       if (isLoggedIn && isAuthPage) {
//         snackBar.error('You are already logged in');

//         return router.createUrlTree(['/']);
//       }

//       if (!isLoggedIn && isAuthPage) {
//         return true;
//       }

//       if (!isLoggedIn) {
//         snackBar.error('Please login first');

//         localStorage.setItem('redirectUrl', state.url);

//         return router.createUrlTree(['/login']);
//       }

//       return true;
//     }),
//   );
// };
