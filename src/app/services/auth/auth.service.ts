import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../app.config';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.checkInitialSession()
  );
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(registerObj: object): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${API_BASE_URL.authServiceApi}auth/register`,
      registerObj
    );
  }

  login(loginObj: object): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${API_BASE_URL.authServiceApi}auth/login`,
        loginObj,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user_id');
    this.isLoggedInSubject.next(false);
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('user_id', authResult.data._id);
    this.isLoggedInSubject.next(true);
  }

  public hasValidSession(): boolean {
    return !!localStorage.getItem('user_id');
  }

  private checkInitialSession(): boolean {
    return !!localStorage.getItem('user_id');
  }
}
