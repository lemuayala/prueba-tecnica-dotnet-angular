import { CommonModule } from '@angular/common';
import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UserEffects } from './features/users/store/user.effects';
import { NgrxFormsModule } from 'ngrx-forms';
import { FormsModule } from '@angular/forms';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { userFeature } from './features/users/store/user.reducer';
import { HeaderComponent } from './features/shared/components/header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    NgrxFormsModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      // <-- Configuración de PrimeNG
      theme: {
        options: {
          prefix: 'p',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, components',
          },
        },
        preset: Material,
      },
      inputStyle: 'outlined',
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ [userFeature.name]: userFeature.reducer }),
    provideEffects(UserEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
