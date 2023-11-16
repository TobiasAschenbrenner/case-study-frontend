import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};

export const API_BASE_URL = {
  authServiceApi: 'http://localhost:8800/api/auth/',
};
