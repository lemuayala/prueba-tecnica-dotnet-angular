import { CommonModule } from '@angular/common';
import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UserEffects } from './features/users/store/user.effects';
import { NgrxFormsModule } from 'ngrx-forms';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    NgrxFormsModule,
    ButtonModule,
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
        preset: Aura,
      },
      inputStyle: 'outlined',
    }),
    provideHttpClient(),
    provideStore(),
    provideEffects(UserEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
