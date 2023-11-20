import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EmailService } from './email.service';
import { API_BASE_URL } from '../../app.config';

describe('EmailService', () => {
  let service: EmailService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmailService],
    });
    service = TestBed.inject(EmailService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send an email', () => {
    const testEmail = 'test@example.com';
    const mockResponse = {
      success: true,
      status: 200,
      message: 'Email sent successfully!',
    };

    service.sendEmail(testEmail).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpController.expectOne(
      `${API_BASE_URL.authServiceApi}auth/send-email`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: testEmail });
    req.flush(mockResponse);
  });
});
