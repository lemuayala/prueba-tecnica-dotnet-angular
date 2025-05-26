import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from './features/users/store/user.actions';
import { LoginResponseDto } from './features/users/models/auth.model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'travel-sharing-frontend';
  private store = inject(Store);
  private router = inject(Router);

  isLandingPage = false;

  ngOnInit(): void {
    this.tryRehydrateAuthState();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isLandingPage =
          event.urlAfterRedirects === '/' ||
          event.urlAfterRedirects === '/auth/login' ||
          event.urlAfterRedirects === '/auth/register';
      });
  }

  private tryRehydrateAuthState(): void {
    const token = localStorage.getItem('authToken');
    const expirationString = localStorage.getItem('tokenExpiration');
    const currentUserString = localStorage.getItem('currentUser');

    if (token && expirationString && currentUserString) {
      const expirationDate = new Date(expirationString);
      if (expirationDate > new Date()) {
        // Verificar si el token no ha expirado
        try {
          const currentUserData = JSON.parse(currentUserString);
          const rehydratedResponse: LoginResponseDto = {
            token: token,
            expiration: expirationString,
            ...currentUserData,
          };
          this.store.dispatch(
            UserActions.rehydrateAuthState({ response: rehydratedResponse })
          );
        } catch (e) {
          console.error('Error parsing currentUser from localStorage', e);
        }
      } else {
        // Token expirado, limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('tokenExpiration');
      }
    }
  }
}
