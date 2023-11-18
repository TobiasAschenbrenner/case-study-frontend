import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  isLoggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  registerService(registerObj: any) {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}auth/register`,
      registerObj
    );
  }

  loginService(loginObj: any) {
    return this.http
      .post<any>(`${API_BASE_URL.authServiceApi}auth/login`, loginObj, {
        withCredentials: true,
      })
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
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}auth/send-email`,
      {
        email: email,
      }
    );
  }

  resetPasswordService(resetObj: any) {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}auth/reset-password`,
      resetObj
    );
  }

  isLoggedIn() {
    return !!localStorage.getItem('user_id');
  }

  getUserById(userId: string) {
    return this.http.get<any>(`${API_BASE_URL.authServiceApi}user/${userId}`, {
      withCredentials: true,
    });
  }
}
