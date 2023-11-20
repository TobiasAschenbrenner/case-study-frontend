import { TestBed } from '@angular/core/testing';
import { PasswordService } from './password.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { API_BASE_URL } from '../../app.config';

describe('PasswordService', () => {
  let service: PasswordService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PasswordService],
    });
    service = TestBed.inject(PasswordService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a password reset request', () => {
    const mockResetObj = { token: 'mock-token', password: 'newPassword123' };
    const mockResponse = {
      success: true,
      status: 200,
      message: 'Password updated successfully!',
    };

    service.resetPassword(mockResetObj).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpController.expectOne(
      `${API_BASE_URL.authServiceApi}auth/reset-password`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockResetObj);
    req.flush(mockResponse);
  });
});
