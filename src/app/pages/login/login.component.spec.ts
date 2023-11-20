import { ComponentFixture, TestBed } from '@angular/core/testing';
import LoginComponent from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should call AuthService login on form submit and navigate on success', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const mockAuthResponse: AuthResponse = {
      success: true,
      data: {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'mock-token',
    };

    mockAuthService.login.and.returnValue(of(mockAuthResponse));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password',
    });
    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should handle login error', () => {
    mockAuthService.login.and.returnValue(
      throwError(() => new Error('Login failed'))
    );
    spyOn(console, 'log');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password',
    });
    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(console.log).toHaveBeenCalledWith('Failed to login');
  });
});
