import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const injector = inject(Injector);

  return from(auth.authStateReady()).pipe(
    switchMap(() => runInInjectionContext(injector, () => authState(auth)).pipe(take(1))),
    map((user) => {
      const isLoginPage = state.url.startsWith('/admin/login');

      if (user && isLoginPage) {
        return router.createUrlTree(['/admin/dashboard']);
      }

      if (!user && !isLoginPage) {
        return router.createUrlTree(['/admin/login'], {
          // queryParams: { returnUrl: state.url },
        });
      }

      return true;
    }),
  );
};
