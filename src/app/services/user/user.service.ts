import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../app.config';
import { Observable } from 'rxjs';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  data: {
    isAdmin: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${API_BASE_URL.authServiceApi}user/${userId}`, {
      withCredentials: true,
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_BASE_URL.authServiceApi}user`, {
      withCredentials: true,
    });
  }
}
