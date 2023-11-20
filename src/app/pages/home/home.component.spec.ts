import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { UserService } from 'src/app/services/user/user.service';
import { of } from 'rxjs';

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

const mockUser: BaseUser = {
  _id: '123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john@example.com',
  profilePicture: 'profile.jpg',
  isAdmin: false,
};

const mockAdminUser = {
  ...mockUser,
  isAdmin: true,
};

const mockUsers = {
  data: {
    0: mockUser,
    1: { ...mockUser, _id: '124', username: 'janedoe' },
  },
};

class MockUserService {
  getUserById(id: string) {
    return of({ data: id === 'admin_id' ? mockAdminUser : mockUser });
  }

  getAllUsers() {
    return of(mockUsers);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUserService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: UserService, useClass: MockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('user_id');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user profile on init', () => {
    spyOn(mockUserService, 'getUserById').and.callThrough();
    localStorage.setItem('user_id', '123');
    component.ngOnInit();

    expect(mockUserService.getUserById).toHaveBeenCalledWith('123');
    expect(component.userProfile).toBeDefined();
    expect(component.userProfile.data).toEqual(mockUser);
  });

  it('should fetch all users if user is admin', () => {
    spyOn(mockUserService, 'getAllUsers').and.callThrough();
    localStorage.setItem('user_id', 'admin_id');
    component.ngOnInit();

    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.allUsersArray).toBeDefined();
    expect(component.allUsersArray.length).toBeGreaterThan(0);
  });
});
