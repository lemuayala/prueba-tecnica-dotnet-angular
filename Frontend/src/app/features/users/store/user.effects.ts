import { Injectable, inject } from '@angular/core'; // Importa inject
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  map,
  concatMap,
  switchMap,
  mergeMap,
} from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { UserActions } from './user.actions';
import { User } from '../models/user.model';
import { Update } from '@ngrx/entity';

@Injectable()
export class UserEffects {
  // Inyecta las dependencias usando la función inject()
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      // Ahora this.actions$ debería estar inicializado correctamente
      ofType(UserActions.loadUsers),
      // Usa switchMap para cancelar peticiones anteriores si se dispara de nuevo rápidamente
      switchMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error })))
        )
      )
    );
  });

  createUser$ = createEffect(() => {
    return this.actions$.pipe(
      // Usa el actions$ inyectado
      ofType(UserActions.createUser),
      // Usa concatMap para procesar creaciones en orden
      concatMap((action) =>
        this.userService.createUser(action.user).pipe(
          map((user: User) => UserActions.createUserSuccess({ user })),
          catchError((error) => of(UserActions.createUserFailure({ error })))
        )
      )
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      // Usa el actions$ inyectado
      ofType(UserActions.updateUser),
      // Usa concatMap para procesar actualizaciones en orden
      concatMap((action) =>
        this.userService.updateUser(action.id, action.user).pipe(
          map(() =>
            UserActions.updateUserSuccess({
              user: { id: action.id, changes: action.user },
            })
          ),
          catchError((error) => of(UserActions.updateUserFailure({ error })))
        )
      )
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      // Usa el actions$ inyectado
      ofType(UserActions.deleteUser),
      // Usa mergeMap para permitir borrados en paralelo si es necesario
      mergeMap((action) =>
        this.userService.deleteUser(action.id).pipe(
          map(() => UserActions.deleteUserSuccess({ id: action.id })),
          catchError((error) => of(UserActions.deleteUserFailure({ error })))
        )
      )
    );
  });

  // El constructor puede quedar vacío si solo se usaba para inyección
  // constructor() {}
}
