import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity'; // Para actualizaciones parciales
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

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

export const UserActions = { ...UserApiActions };
