import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    Object.defineProperty(mockAuthService, 'isLoggedIn$', {
      get: () => isLoggedInSubject.asObservable(),
    });

    TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect the login status based on AuthService', () => {
    isLoggedInSubject.next(true);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeTrue();

    isLoggedInSubject.next(false);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeFalse();
  });

  it('should call AuthService logout method on logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
