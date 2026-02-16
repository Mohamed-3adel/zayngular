import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import Aura from '@primeuix/themes/aura';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { provideToastr } from 'ngx-toastr';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { headersInterceptor } from './core/interceptors/headers/headers-interceptor';
import { loadingInterceptor } from './core/interceptors/loading/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideToastr(),
    provideHttpClient(withFetch(), withInterceptors([headersInterceptor, loadingInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'ar',
      lang: 'en',
    }),

    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
  ],
};
