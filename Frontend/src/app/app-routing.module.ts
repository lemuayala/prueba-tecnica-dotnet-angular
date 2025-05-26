import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { userFeature } from './features/users/store/user.reducer';
import { UserFormComponent } from './features/users/components/user-form/user-form.component';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { publicGuard } from './features/auth/guards/public.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [publicGuard],
  },
  {
    path: 'users',
    canActivate: [authGuard],
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
