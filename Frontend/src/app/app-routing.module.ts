import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { userFeature } from './features/users/store/user.reducer';
import { UserFormComponent } from './features/users/components/user-form/user-form.component';
import { UserListComponent } from './features/users/components/user-list/user-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'users',
    providers: [
      provideState(userFeature), // Registra el reducer y los selectores del feature
    ],
    children: [
      { path: 'new', component: UserFormComponent },
      { path: 'edit/:id', component: UserFormComponent },
      { path: 'list', component: UserListComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
