import { Injectable, inject } from '@angular/core'; // Importa inject
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  map,
  concatMap,
  switchMap,
  mergeMap,
  tap,
} from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { UserActions } from './user.actions';
import { User } from '../models/user.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject(Store);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
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

  // Efecto para mostrar toast de éxito y navegar después de crear (YA ESTABA)
  createUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.createUserSuccess),
        tap(({ user }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Usuario ${user.name} creado correctamente.`,
          });
          this.router.navigate(['/users/list']); // Navega a la lista
        })
      );
    },
    { dispatch: false }
  );

  // Efecto para mostrar toast de error al crear
  createUserFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.createUserFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error al crear usuario: ${
              error.message || 'Intente de nuevo'
            }`,
          });
        })
      );
    },
    { dispatch: false }
  );

  // Efecto para mostrar toast de éxito al actualizar
  updateUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.updateUserSuccess),
        tap(({ user }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Usuario actualizado correctamente.`,
          });
          this.router.navigate(['/users/list']);
        })
      );
    },
    { dispatch: false }
  );

  // Efecto para mostrar toast de error al actualizar
  updateUserFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.updateUserFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error al actualizar usuario: ${
              error.message || 'Intente de nuevo'
            }`,
          });
        })
      );
    },
    { dispatch: false }
  );
}
