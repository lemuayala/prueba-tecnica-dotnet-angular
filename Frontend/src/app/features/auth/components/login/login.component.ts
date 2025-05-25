import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUserDto } from '../../../users/models/auth.model';
import { UserActions } from '../../../users/store/user.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  selectIsLoggingIn,
  selectLoginError,
} from '../../../users/store/user.selectors';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loginForm!: FormGroup;
  isLoggingIn$!: Observable<boolean>;
  loginError$!: Observable<any | null>;

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.isLoggingIn$ = this.store.select(selectIsLoggingIn);
    this.loginError$ = this.store.select(selectLoginError);

    this.subscriptions.add(
      this.loginError$.subscribe((error) => {
        if (error && error.message) {
        }
      })
    );
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginUserDto = this.loginForm.value;
    this.store.dispatch(UserActions.loginUser({ credentials }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
