import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: false,
})
export class RegisterComponent {
  registerForm: FormGroup;

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Si los campos aún no existen o no tienen valor, no validar aún
    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
  };

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      vehicleDetails: [''] 
    }, { validators: this.passwordsMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como 'touched' para mostrar errores si es necesario
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      console.log('Formulario de registro inválido');
      return;
    }
    console.log('Formulario de registro enviado (simulación):', this.registerForm.value);
    // Aquí irá la lógica de registro real más adelante
  }
}
