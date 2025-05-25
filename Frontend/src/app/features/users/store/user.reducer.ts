import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  createFormGroupState,
  onNgrxForms,
  updateGroup,
  setValue,
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
  creating: boolean;
  createError: any | null;
  registering: boolean;
  registerError: any | null;
  // Nuevos estados para el login
  loggingIn: boolean;
  loginError: any | null;
  isAuthenticated: boolean;
  currentUser: import('../models/auth.model').LoginResponseDto | null; // O un subconjunto
  authToken: string | null;
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialUserEntityState: UserEntityState =
  userAdapter.getInitialState({
    selectedUserId: null,
    loading: false,
    error: null,
    creating: false,
    createError: null,
    registering: false,
    registerError: null,
    // Estados iniciales para login
    loggingIn: false,
    loginError: null,
    isAuthenticated: false,
    currentUser: null,
    authToken: null,
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

  // Acciones de Crear Usuario
  on(UserActions.createUser, (state) => ({
    ...state,
    users: { ...state.users, creating: true, createError: null },
  })),
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: userAdapter.addOne(user, { ...state.users, creating: false }),
  })),
  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    users: { ...state.users, creating: false, createError: error },
  })),

  // Acciones para Eliminar Usuario
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: userAdapter.removeOne(id, state.users),
  })),

  // Acciones para manejar el estado del formulario explícitamente
  on(UserActions.setFormValue, (state, { user }) => ({
    ...state,
    // Usamos setValue para reemplazar completamente el valor del formulario
    userForm: setValue(state.userForm, user),
  })),
  on(UserActions.resetForm, (state) => ({
    ...state,
    // Reseteamos al estado inicial del formulario
    userForm: initialUserFormState,
  })),

  // Acciones para el Registro de Usuario
  on(UserActions.registerUser, (state) => ({
    ...state,
    users: { ...state.users, registering: true, registerError: null },
  })),
  on(UserActions.registerUserSuccess, (state, { user }) => ({
    ...state,

    users: userAdapter.addOne(user, { ...state.users, registering: false }),
  })),
  on(UserActions.registerUserFailure, (state, { error }) => ({
    ...state,
    users: { ...state.users, registering: false, registerError: error },
  })),

  // Acciones para el Login de Usuario
  on(UserActions.loginUser, (state) => ({
    ...state,
    users: {
      ...state.users,
      loggingIn: true,
      loginError: null,
      isAuthenticated: false,
      currentUser: null,
      authToken: null,
    },
  })),
  on(UserActions.loginUserSuccess, (state, { response }) => ({
    ...state,
    users: {
      ...state.users,
      loggingIn: false,
      isAuthenticated: true,
      currentUser: response,
      authToken: response.token,
      loginError: null,
    },
  })),
  on(UserActions.loginUserFailure, (state, { error }) => ({
    ...state,
    users: {
      ...state.users,
      loggingIn: false,
      isAuthenticated: false,
      loginError: error,
      currentUser: null,
      authToken: null,
    },
  })),

  // Acción para rehidratar el estado de autenticación
  on(UserActions.rehydrateAuthState, (state, { response }) => {
    if (response && response.token) {
      return {
        ...state,
        users: {
          ...state.users,
          isAuthenticated: true,
          currentUser: response,
          authToken: response.token,
        },
      };
    }
    return state; // Si no hay datos válidos para rehidratar, devolver el estado actual
  })
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
