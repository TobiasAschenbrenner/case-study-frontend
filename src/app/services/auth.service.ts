import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';
import { BehaviorSubject, tap } from 'rxjs';

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
    return this.http
      .post<any>(`${API_BASE_URL.authServiceApi}login`, loginObj)
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  private setSession(authResult: any) {
    localStorage.setItem('user_id', authResult.data._id);
    localStorage.setItem('username', authResult.data.username);
    this.isLoggedIn$.next(true);
  }

  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    this.isLoggedIn$.next(false);
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
