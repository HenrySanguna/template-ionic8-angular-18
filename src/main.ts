import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, inject, isDevMode } from '@angular/core';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { TranslocoHttpLoader } from './app/core/i18n/transloco-loader';
import { httpErrorInterceptor } from './app/core/interceptors/http-error.interceptor';

// Datos de localización
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import localePt from '@angular/common/locales/pt-PT';

// Registrar locales
registerLocaleData(localeEs, 'es');
registerLocaleData(localeEn, 'en');
registerLocaleData(localePt, 'pt');

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideIonicAngular(),
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['es', 'en', 'pt'],
        defaultLang: 'es',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translocoService = inject(TranslocoService);
        return () => {
          const savedLang = sessionStorage.getItem('lang') ?? 'es';
          translocoService.setActiveLang(savedLang);
          return translocoService.load(savedLang).toPromise();
        };
      },
      multi: true,
    },

    // Configuración de pipes
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: 'dd/MM/yyyy' },
    },
  ],
});
