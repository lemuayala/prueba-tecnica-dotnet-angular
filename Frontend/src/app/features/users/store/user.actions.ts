import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity'; // Para actualizaciones parciales
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';
import { UserFormValue } from './user.reducer'; // Importa el tipo del valor del formulario
import {
  RegisterUserDto,
  LoginUserDto,
  LoginResponseDto,
} from '../models/auth.model';

export const UserApiActions = createActionGroup({
  source: 'User API',
  events: {
    // Load Users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: any }>(),

    // Create User
    'Create User': props<{ user: CreateUserDto }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: any }>(),

    // Update User
    'Update User': props<{ id: string; user: UpdateUserDto }>(),
    'Update User Success': props<{ user: Update<User> }>(),
    'Update User Failure': props<{ error: any }>(),

    // Delete User
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: any }>(),
  },
});

export const AuthApiActions = createActionGroup({
  source: 'Auth API',
  events: {
    // Register User
    'Register User': props<{ user: RegisterUserDto }>(),
    'Register User Success': props<{ user: User }>(),
    'Register User Failure': props<{ error: any }>(),
    // Login User
    'Login User': props<{ credentials: LoginUserDto }>(),
    'Login User Success': props<{ response: LoginResponseDto }>(),
    'Login User Failure': props<{ error: any }>(),
    // Acción para rehidratar el estado de autenticación desde localStorage
    'Rehydrate Auth State': props<{ response: LoginResponseDto | null }>(),
    // Logout User
    'Logout User': emptyProps(),
  },
});

export const UserFormActions = createActionGroup({
  source: 'User Form',
  events: {
    'Set Form Value': props<{ user: UserFormValue }>(),
    'Reset Form': emptyProps(),
  },
});

export const UserActions = {
  ...UserApiActions,
  ...AuthApiActions,
  ...UserFormActions,
};
