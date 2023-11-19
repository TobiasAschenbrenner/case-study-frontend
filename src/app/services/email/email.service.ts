import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(email: string): Observable<any> {
    return this.http.post<any>(
      `${API_BASE_URL.authServiceApi}auth/send-email`,
      { email }
    );
  }
}
