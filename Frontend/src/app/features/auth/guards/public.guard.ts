import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../users/store/user.selectors'; // Ajusta la ruta
import { inject } from '@angular/core';

export const publicGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        // Si el usuario está autenticado, redirigir a la página principal
        router.navigate(['/users/list']);
        return false;
      }
      return true; // Si no está autenticado, permitir acceso
    })
  );
};
