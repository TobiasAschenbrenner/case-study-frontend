import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  registerService(registerObj: any) {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}register`,
      registerObj
    );
  }

  loginService(loginObj: any) {
    return this.http.post<any>(`${API_BASE_URL.authServiceApi}login`, loginObj);
  }

  sendEmailService(email: string) {
    return this.http.post<any>(`${API_BASE_URL.authServiceApi}send-email`, {
      email: email,
    });
  }

  resetPasswordService(resetObj: any) {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}reset-password`,
      resetObj
    );
  }

  isLoggedIn() {
    return !!localStorage.getItem('user_id');
  }
}
