import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../app.config';
import { Observable } from 'rxjs';

interface BaseUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
}

interface User {
  data: BaseUser;
}

interface AllUser {
  data: {
    [key: number]: BaseUser;
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

  getAllUsers(): Observable<AllUser> {
    return this.http.get<AllUser>(`${API_BASE_URL.authServiceApi}user`, {
      withCredentials: true,
    });
  }
}
