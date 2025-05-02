import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table'; // Importa TableModule
import { ButtonModule } from 'primeng/button'; // Para futuros botones
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Para indicador de carga
import { MessageModule } from 'primeng/message'; // Para mostrar errores

import { UserActions } from '../../store/user.actions';
import {
  selectAllUsers,
  selectUserError,
  selectUserLoading,
} from '../../store/user.selectors';
import { UpdateUserDto, User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  users$ = this.store.select(selectAllUsers);
  loading$ = this.store.select(selectUserLoading);
  error$ = this.store.select(selectUserError);

  ngOnInit(): void {
    // Despacha la acción para cargar los usuarios cuando el componente se inicializa
    this.store.dispatch(UserActions.loadUsers());
  }

  deleteUser(userId: string): void {
    // Despacha la acción para eliminar el usuario
    this.store.dispatch(UserActions.deleteUser({ id: userId }));
  }

  editUser(user: UpdateUserDto): void {
    // Despacha la acción para editar el usuario
    this.store.dispatch(UserActions.updateUser({ id: user.id, user: user }));
  }

  navigateToCreateUser(): void {
    // Navega a la ruta del formulario de creación
    this.router.navigate(['/users/new']);
  }
}
