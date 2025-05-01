import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { userFeature } from './features/users/store/user.reducer';
import { UserFormComponent } from './features/users/components/user-form/user-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  {
    path: 'users',
    component: UserFormComponent,
    providers: [
      provideState(userFeature), // Registra el reducer y los selectores del feature
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
