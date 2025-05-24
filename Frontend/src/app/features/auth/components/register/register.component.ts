import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { selectUserRegisterError, selectUserRegistering } from '../../../users/store/user.selectors';
import { RegisterUserDto } from '../../../users/models/auth.model';
import { UserActions } from '../../../users/store/user.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: false,
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  registerForm!: FormGroup;
  isRegistering$!: Observable<boolean>;
  registerError$!: Observable<any | null>;

  private subscriptions = new Subscription();

  // Validador personalizado para comparar contraseñas
  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      vehicleDetails: ['']
    }, { validators: RegisterComponent.passwordsMatch });

    this.isRegistering$ = this.store.select(selectUserRegistering);
    this.registerError$ = this.store.select(selectUserRegisterError);

    this.subscriptions.add(
      this.registerError$.subscribe(error => {
        if (error && error.message) {
          if (error.message.toLowerCase().includes('email') || error.message.toLowerCase().includes('correo')) {
            this.registerForm.get('email')?.setErrors({ serverError: error.message });
          }
        }
      })
    );
  }

   onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
      return;
    }

    const { confirmPassword, ...formData } = this.registerForm.value;
    const registerDto: RegisterUserDto = formData;

    this.store.dispatch(UserActions.registerUser({ user: registerDto }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
