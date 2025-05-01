import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  createFormGroupState,
  onNgrxForms,
  updateGroup,
  wrapReducerWithFormStateUpdate,
  validate,
} from 'ngrx-forms';
import { required, email } from 'ngrx-forms/validation';

import { User, CreateUserDto } from '../models/user.model';
import { UserActions } from './user.actions';

// Define la estructura del estado del formulario con ngrx-forms
export const USER_FORM_ID = 'userForm';
export interface UserFormValue extends CreateUserDto {}

// Define la validación para el formulario usando ngrx-forms
const userFormValidation = updateGroup<UserFormValue>({
  name: validate(required),
  email: validate(required, email),
  phoneNumber: validate(required),
  vehicleDetails: validate([]),
});

// Estado de la entidad User usando @ngrx/entity
export interface UserEntityState extends EntityState<User> {
  selectedUserId: string | null;
  loading: boolean;
  error: any | null;
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialUserEntityState: UserEntityState =
  userAdapter.getInitialState({
    selectedUserId: null,
    loading: false,
    error: null,
  });

// Combina el estado de la entidad y el estado del formulario
export interface State {
  users: UserEntityState;
  userForm: typeof initialUserFormState;
}

// Crea el estado inicial del formulario
export const initialUserFormState = createFormGroupState<UserFormValue>(
  USER_FORM_ID,
  {
    name: '',
    email: '',
    phoneNumber: '',
    vehicleDetails: null,
  }
);

// Estado inicial combinado
export const initialState: State = {
  users: initialUserEntityState,
  userForm: initialUserFormState,
};

// Crea el reducer principal combinando el reducer de ngrx-forms y el de la entidad
const userFeatureReducer = createReducer(
  initialState,
  // Escucha acciones de ngrx-forms (automáticamente maneja el estado del form)
  onNgrxForms(),

  // Reducer para la entidad User
  on(UserActions.loadUsers, (state) => ({
    ...state,
    users: { ...state.users, loading: true, error: null },
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: userAdapter.setAll(users, { ...state.users, loading: false }),
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    users: { ...state.users, loading: false, error },
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: userAdapter.removeOne(id, state.users),
  }))
);

// Envuelve el reducer con la lógica de ngrx-forms y aplica validación
export const userReducer = wrapReducerWithFormStateUpdate(
  userFeatureReducer,
  (state) => state.userForm,
  userFormValidation
);
export const userFeature = createFeature({
  name: 'userFeature',
  reducer: userReducer,
});
