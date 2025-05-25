import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { selectIsAuthenticated } from '../../users/store/user.selectors';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/internal/operators/take';
import { map } from 'rxjs/internal/operators/map';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) return true;

      router.navigate(['/auth/login']);
      return false;
    })
  );
};
