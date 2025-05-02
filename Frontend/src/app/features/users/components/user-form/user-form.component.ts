import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MarkAsSubmittedAction, NgrxFormsModule } from 'ngrx-forms';
import { FormControlState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import {
  selectUserById,
  selectUserCreating,
  selectUserFormState,
} from '../../store/user.selectors';
import { USER_FORM_ID } from '../../store/user.reducer';
import { take } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../../models/user.model';
import { UserActions } from '../../store/user.actions';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    NgrxFormsModule,
    InputMaskModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    CardModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  formState$ = this.store.select(selectUserFormState);
  isCreating$ = this.store.select(selectUserCreating);
  userFormId = USER_FORM_ID;
  isEditMode = false;
  currentUserId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        take(1)
      )
      .subscribe((id) => {
        if (id) {
          // Modo Edición
          this.isEditMode = true;
          this.currentUserId = id;
          // Selecciona el usuario del store y despacha la acción para poblar el formulario
          this.store
            .select(selectUserById(id))
            .pipe(
              filter((user) => !!user),
              take(1)
            )
            .subscribe((user) => {
              if (user) {
                // Mapea el User a UserFormValue (CreateUserDto)
                const formValue: UpdateUserDto = {
                  name: user.name,
                  email: user.email,
                  phoneNumber: user.phoneNumber,
                  vehicleDetails: user.vehicleDetails,
                };
                this.store.dispatch(
                  UserActions.setFormValue({ user: formValue })
                );
              }
            });
        } else {
          // Modo Creación
          this.isEditMode = false;
          this.currentUserId = null;
          // Resetea el formulario al estado inicial
          this.store.dispatch(UserActions.resetForm());
        }
      });
  }

  public onSubmit(): void {
    // Tomamos el estado actual del formulario desde el store
    this.formState$.pipe(take(1)).subscribe((state) => {
      if (state.isValid) {
        console.log('Formulario ngrx-forms válido. Enviando:', state.value);

        const userData: UpdateUserDto = {
          name: state.value.name,
          email: state.value.email,
          phoneNumber: state.value.phoneNumber.toString(),
          vehicleDetails: state.value.vehicleDetails || null,
        };

        if (this.isEditMode && this.currentUserId) {
          userData.id = this.currentUserId;
          this.store.dispatch(
            UserActions.updateUser({ id: this.currentUserId, user: userData })
          );
        } else {
          // Modo Creación: Despacha acción de crear
          this.store.dispatch(UserActions.createUser({ user: userData }));
        }
      } else {
        console.log('Formulario ngrx-forms inválido', state.errors);
        // ngrx-forms puede marcar controles como submitted automáticamente o puedes despachar una acción
        this.store.dispatch(new MarkAsSubmittedAction(this.userFormId));
      }
    });
  }
}
