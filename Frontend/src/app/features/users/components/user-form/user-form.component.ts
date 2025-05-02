import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MarkAsSubmittedAction, NgrxFormsModule } from 'ngrx-forms';
import { FormControlState, SetUserDefinedPropertyAction } from 'ngrx-forms';
import { selectUserFormState } from '../../store/user.selectors';
import { USER_FORM_ID } from '../../store/user.reducer';
import { take } from 'rxjs';
import { CreateUserDto } from '../../models/user.model';
import { UserActions } from '../../store/user.actions';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';

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

  formState$ = this.store.select(selectUserFormState);
  userFormId = USER_FORM_ID;

  ngOnInit(): void {}

  onSubmit(): void {
    // Tomamos el estado actual del formulario desde el store
    this.formState$.pipe(take(1)).subscribe((state) => {
      if (state.isValid) {
        console.log('Formulario ngrx-forms válido. Enviando:', state.value);

        const userToCreate: CreateUserDto = {
          name: state.value.name,
          email: state.value.email,
          phoneNumber: state.value.phoneNumber,
          vehicleDetails: state.value.vehicleDetails || null,
        };
        // Despachamos la acción de NgRx
        this.store.dispatch(UserActions.createUser({ user: userToCreate }));
      } else {
        console.log('Formulario ngrx-forms inválido');
        // ngrx-forms puede marcar controles como submitted automáticamente o puedes despachar una acción
        this.store.dispatch(new MarkAsSubmittedAction(this.userFormId));
      }
    });
  }
}
