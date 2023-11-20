import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { API_BASE_URL } from '../../app.config';

describe('UserService', () => {
  let service: UserService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by ID', () => {
    const mockUser = {
      data: {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        profilePicture: 'john.jpg',
        isAdmin: false,
      },
    };

    service.getUserById('123').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpController.expectOne(
      `${API_BASE_URL.authServiceApi}user/123`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should retrieve all users', () => {
    const mockUsers = {
      data: {
        0: {
          _id: '123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          profilePicture: 'john.jpg',
          isAdmin: false,
        },
        1: {
          _id: '124',
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'janedoe',
          email: 'jane@example.com',
          profilePicture: 'jane.jpg',
          isAdmin: true,
        },
      },
    };

    service.getAllUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpController.expectOne(`${API_BASE_URL.authServiceApi}user`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
