import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  registerService(registerObj: any) {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}register`,
      registerObj
    );
  }

  loginService(loginObj: any) {
    return this.http.post<any>(`${API_BASE_URL.authServiceApi}login`, loginObj);
  }
}
