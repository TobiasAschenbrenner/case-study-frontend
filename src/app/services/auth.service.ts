import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../app.config';
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

interface AuthResponse {
  success: boolean;
  data: User;
  token: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasValidSession()
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

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('user_id', authResult.data._id);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('user_id');
    this.isLoggedInSubject.next(false);
  }

  sendEmailService(email: string): Observable<any> {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}auth/send-email`,
      { email }
    );
  }

  resetPasswordService(resetObj: object): Observable<any> {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}auth/reset-password`,
      resetObj
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_id');
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${API_BASE_URL.authServiceApi}user/${userId}`, {
      withCredentials: true,
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<User[]>(`${API_BASE_URL.authServiceApi}user`, {
      withCredentials: true,
    });
  }

  private hasValidSession(): boolean {
    return this.isLoggedIn();
  }
}
