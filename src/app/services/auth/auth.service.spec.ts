import { TestBed } from '@angular/core/testing';
import { AuthService, AuthResponse } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { API_BASE_URL } from '../../app.config';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const mockUser = {
      _id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockResponse = {
      success: true,
      data: mockUser,
      token: 'mock-token',
    };

    service.register(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpController.expectOne(
      `${API_BASE_URL.authServiceApi}auth/register`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login a user and set session', () => {
    const mockLoginObj = { email: 'john@example.com', password: 'password123' };
    const mockResponse: AuthResponse = {
      success: true,
      data: {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'mock-token',
    };

    service.login(mockLoginObj).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('user_id')).toBe('123');
      expect(service.hasValidSession()).toBeTrue();
    });

    const req = httpController.expectOne(
      `${API_BASE_URL.authServiceApi}auth/login`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should log out a user and clear session', () => {
    localStorage.setItem('user_id', '123');
    service.logout();
    expect(localStorage.getItem('user_id')).toBeNull();
    expect(service.hasValidSession()).toBeFalse();
  });
});
