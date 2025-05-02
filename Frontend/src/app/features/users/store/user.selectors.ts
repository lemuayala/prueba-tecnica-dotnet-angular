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
