import { ComponentFixture, TestBed } from '@angular/core/testing';
import RegisterComponent from './register.component';
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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const user: User = {
    _id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse: AuthResponse = {
    success: true,
    data: user,
    token: 'mock-token',
  };

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'register',
      'login',
    ]);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the registration form with required fields', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.controls['firstName']).toBeDefined();
    expect(component.registerForm.controls['lastName']).toBeDefined();
    expect(component.registerForm.controls['username']).toBeDefined();
    expect(component.registerForm.controls['email']).toBeDefined();
    expect(component.registerForm.controls['password']).toBeDefined();
    expect(component.registerForm.controls['confirmPassword']).toBeDefined();
  });

  it('should call AuthService register and login on form submit and navigate on success', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    mockAuthService.register.and.returnValue(of(mockAuthResponse));
    mockAuthService.login.and.returnValue(of(mockAuthResponse));

    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      confirmPassword: 'password',
    });
    component.register();

    expect(mockAuthService.register).toHaveBeenCalledWith(jasmine.any(Object));
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password',
    });
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('should handle registration error', () => {
    mockAuthService.register.and.returnValue(
      throwError(() => new Error('Registration failed'))
    );
    spyOn(console, 'log');

    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
      confirmPassword: 'password',
    });
    component.register();

    expect(mockAuthService.register).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'Registration error:',
      jasmine.anything()
    );
  });
});
