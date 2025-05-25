import { createSelector } from '@ngrx/store';
import {
  userAdapter,
  UserEntityState,
  userFeature,
  State as UserFeatureState,
} from './user.reducer';

// Selectores usando createFeature (preferido)
const { selectUserFeatureState, selectUsers, selectUserForm } = userFeature;

// Obtener los selectores básicos del adapter de @ngrx/entity
const { selectAll, selectEntities, selectIds, selectTotal } =
  userAdapter.getSelectors(selectUsers);

// Exportar los selectores que necesites en tus componentes
export const selectAllUsers = selectAll;
export const selectUserEntities = selectEntities;
export const selectUserIds = selectIds;
export const selectUserTotal = selectTotal;

export const selectUserLoading = createSelector(
  selectUsers,
  (state: UserEntityState) => state.loading
);
export const selectUserError = createSelector(
  selectUsers,
  (state: UserEntityState) => state.error
);

export const selectUserCreating = createSelector(
  selectUsers,
  (state: UserEntityState) => state.creating
);

// Selector para el estado del formulario de usuario usando ngrx-forms
export const selectUserFormState = selectUserForm;

export const selectUserById = (id: string) =>
  createSelector(selectUserEntities, (entities) => entities[id]);

// Selectores para el estado de registro
export const selectUserRegistering = createSelector(
  selectUsers,
  (state: UserEntityState) => state.registering
);

export const selectUserRegisterError = createSelector(
  selectUsers,
  (state: UserEntityState) => state.registerError
);

// Selectores para el estado de login
export const selectIsLoggingIn = createSelector(
  selectUsers,
  (state: UserEntityState) => state.loggingIn
);

export const selectLoginError = createSelector(
  selectUsers,
  (state: UserEntityState) => state.loginError
);

export const selectIsAuthenticated = createSelector(
  selectUsers,
  (state: UserEntityState) => state.isAuthenticated
);

export const selectCurrentUser = createSelector(
  selectUsers,
  (state: UserEntityState) => state.currentUser
);

export const selectAuthToken = createSelector(
  selectUsers,
  (state: UserEntityState) => state.authToken
);
