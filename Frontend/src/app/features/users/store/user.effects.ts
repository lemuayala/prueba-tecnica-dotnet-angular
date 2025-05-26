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
  exhaustMap,
} from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { UserActions } from './user.actions';
import { User } from '../models/user.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginResponseDto } from '../models/auth.model';

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

  // Efecto para el registro de usuario
  registerUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.registerUser),
      exhaustMap((action) =>
        this.userService.registerUser(action.user).pipe(
          map((user: User) => UserActions.registerUserSuccess({ user })),
          catchError((error) => of(UserActions.registerUserFailure({ error })))
        )
      )
    );
  });

  // Efecto para mostrar toast de éxito y navegar después del registro
  registerUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.registerUserSuccess),
        tap(({ user }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: `¡Bienvenido, ${user.name}! Tu cuenta ha sido creada.`,
          });
          this.router.navigate(['/auth/login']);
        })
      );
    },
    { dispatch: false }
  );

  // Efecto para mostrar toast de error al registrar
  registerUserFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.registerUserFailure),
        tap(({ error }) => {
          const detail =
            error?.error?.message ||
            error?.message ||
            'Ocurrió un error. Intente de nuevo.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Registro',
            detail: detail,
          });
        })
      );
    },
    { dispatch: false }
  );

  // Efecto para el login de usuario
  loginUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loginUser),
      // Usamos exhaustMap para ignorar nuevos intentos de login mientras uno está en progreso
      exhaustMap((action) =>
        this.userService.loginUser(action.credentials).pipe(
          map((response: LoginResponseDto) =>
            UserActions.loginUserSuccess({ response })
          ),
          catchError((error) => of(UserActions.loginUserFailure({ error })))
        )
      )
    );
  });

  // Efecto para manejar el éxito del login
  loginUserSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.loginUserSuccess),
        tap(({ response }) => {
          // Guardar token e información relevante en localStorage
          localStorage.setItem('authToken', response.token);
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              userId: response.userId,
              email: response.email,
              name: response.name,
              role: response.role,
            })
          );
          localStorage.setItem('tokenExpiration', response.expiration);

          this.messageService.add({
            severity: 'success',
            summary: 'Inicio de Sesión Exitoso',
            detail: `¡Bienvenido de nuevo, ${response.name}!`,
          });
          this.router.navigate(['/users/list']); // Redirigir a la lista de usuarios
        })
      );
    },
    { dispatch: false }
  );

  // Efecto para manejar el fallo del login
  loginUserFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.loginUserFailure),
        tap(({ error }) => {
          const detail =
            error?.error?.message ||
            error?.message ||
            'Credenciales incorrectas o error en el servidor.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Inicio de Sesión',
            detail: detail,
          });
        })
      );
    },
    { dispatch: false }
  );

  logoutUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.logoutUser),
        tap(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('tokenExpiration');
          this.router.navigate(['/auth/login']);
          this.messageService.add({
            severity: 'info',
            summary: 'Sesión Cerrada',
            detail: 'Has cerrado sesión exitosamente.',
          });
        })
      );
    },
    { dispatch: false }
  );
}
