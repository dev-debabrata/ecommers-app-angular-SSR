import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return authState(auth).pipe(
    map((user) => {
      const isLoginPage = state.url.startsWith('/admin/login');

      if (user && isLoginPage) {
        return router.createUrlTree(['/admin']);
      }

      if (!user && !isLoginPage) {
        return router.createUrlTree(['/admin/login']);
      }

      return true;
    }),
  );
};

// import { inject, PLATFORM_ID } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { isPlatformBrowser } from '@angular/common';
// import { map, of } from 'rxjs';
// import { Auth } from '@angular/fire/auth';
// import { authState } from '@angular/fire/auth';

// export const adminAuthGuard: CanActivateFn = (route, state) => {
//   const platformId = inject(PLATFORM_ID);
//   const router = inject(Router);

//   if (!isPlatformBrowser(platformId)) {
//     return of(true);
//   }

//   const auth = inject(Auth);

//   return authState(auth).pipe(
//     map((user) => {
//       const isLoginPage = state.url.startsWith('/admin/login');
//       if (user && isLoginPage) return router.createUrlTree(['/admin']);
//       if (!user && !isLoginPage) return router.createUrlTree(['/admin/login']);
//       return true;
//     }),
//   );
// };
