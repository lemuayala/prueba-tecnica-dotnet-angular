import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';
import { selectAuthToken } from '../../users/store/user.selectors';
import { take } from 'rxjs/internal/operators/take';
import { switchMap } from 'rxjs/internal/operators/switchMap';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);

  // Solo interceptar peticiones a nuestra API
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  return store.select(selectAuthToken).pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
