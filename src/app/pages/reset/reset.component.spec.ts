import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordService } from 'src/app/services/password/password.service';
import ResetComponent from './reset.component';

describe('ResetComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;
  let mockPasswordService: jasmine.SpyObj<PasswordService>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockPasswordService = jasmine.createSpyObj('PasswordService', [
      'resetPassword',
    ]);

    mockActivatedRoute = {
      params: of({ token: 'mock-token' }),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, ResetComponent],
      providers: [
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the reset form with required fields', () => {
    expect(component.resetForm).toBeDefined();
    expect(component.resetForm.controls['password']).toBeDefined();
    expect(component.resetForm.controls['confirmPassword']).toBeDefined();
  });

  it('should extract token from route parameters', () => {
    expect(component.token).toEqual('mock-token');
  });

  it('should call PasswordService resetPassword on valid form submission', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.resetForm.setValue({
      password: 'newPassword',
      confirmPassword: 'newPassword',
    });
    component.token = 'mock-token';

    mockPasswordService.resetPassword.and.returnValue(of({}));

    component.reset();

    expect(mockPasswordService.resetPassword).toHaveBeenCalledWith({
      token: 'mock-token',
      password: 'newPassword',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle reset password error', () => {
    mockPasswordService.resetPassword.and.returnValue(
      throwError(() => new Error('Reset failed'))
    );
    spyOn(console, 'error');

    component.resetForm.setValue({
      password: 'newPassword',
      confirmPassword: 'newPassword',
    });
    component.token = 'mock-token';

    component.reset();

    expect(mockPasswordService.resetPassword).toHaveBeenCalledWith({
      token: 'mock-token',
      password: 'newPassword',
    });
    expect(console.error).toHaveBeenCalledWith(
      'Reset error:',
      jasmine.anything()
    );
  });

  it('should not call resetPassword if form is invalid', () => {
    component.resetForm.setValue({
      password: '',
      confirmPassword: '',
    });
    component.reset();

    expect(mockPasswordService.resetPassword).not.toHaveBeenCalled();
  });
});
