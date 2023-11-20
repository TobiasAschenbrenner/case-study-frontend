import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import AuthGuard from './auth.guard';
import { BehaviorSubject } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    authServiceMock = jasmine.createSpyObj('AuthService', [], {
      isLoggedIn$: isLoggedInSubject.asObservable(),
    });
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        AuthGuard,
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow the authenticated user to access app routes', () => {
    isLoggedInSubject.next(true);

    guard.canActivate().subscribe((isAllowed) => {
      expect(isAllowed).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  it('should redirect an unauthenticated user to the login page', () => {
    isLoggedInSubject.next(false);

    guard.canActivate().subscribe((isAllowed) => {
      expect(isAllowed).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
