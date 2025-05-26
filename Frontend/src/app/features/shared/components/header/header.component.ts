import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../../../users/store/user.selectors'; // Ajusta la ruta si es necesario
import { LoginResponseDto } from '../../../users/models/auth.model'; // Ajusta la ruta si es necesario
import { UserActions } from '../../../users/store/user.actions'; // Ajusta la ruta si es necesario
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  isAuthenticated$!: Observable<boolean>;
  currentUser$!: Observable<LoginResponseDto | null>;
  userNameInitial: string = '';

  isMenuOpen = false;

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.currentUser$ = this.store.select(selectCurrentUser);

    this.currentUser$.subscribe((user) => {
      if (user && user.name) {
        this.userNameInitial = user.name.charAt(0).toUpperCase();
      } else {
        this.userNameInitial = '';
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.isMenuOpen = false; // Cerrar menú al hacer logout
    this.store.dispatch(UserActions.logoutUser());
  }

  navigateToProfile(): void {
    this.isMenuOpen = false;
    // this.router.navigate(['/profile']); // Descomentar y ajustar cuando tengas la ruta de perfil
    console.log('Navegar a perfil (implementar ruta)');
  }
}
