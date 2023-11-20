import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import ForgetPasswordComponent from './forget-password.component';
import { EmailService } from 'src/app/services/email/email.service';
import { RouterTestingModule } from '@angular/router/testing';

class MockEmailService {
  sendEmail() {
    return of({});
  }
}

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let emailService: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ForgetPasswordComponent,
        RouterTestingModule,
      ],
      providers: [
        { provide: EmailService, useClass: MockEmailService },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
    emailService = TestBed.inject(EmailService);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forgetForm on ngOnInit', () => {
    component.ngOnInit();
    expect(component.forgetForm).toBeDefined();
    expect(component.forgetForm.get('email')).toBeDefined();
  });

  it('should validate email field as required', () => {
    const emailControl = component.forgetForm.get('email') as FormControl;
    emailControl.setValue('');
    expect(emailControl.errors?.['required']).toBeTruthy();
    emailControl.setValue('test@example.com');
    expect(emailControl.errors).toBeNull();
  });

  it('should validate the email format', () => {
    const emailControl = component.forgetForm.get('email') as FormControl;
    emailControl.setValue('invalid-email');
    expect(emailControl.errors?.['email']).toBeTruthy();
    emailControl.setValue('valid-email@example.com');
    expect(emailControl.errors).toBeNull();
  });

  it('should call sendEmail on valid form submission', () => {
    spyOn(emailService, 'sendEmail').and.callThrough();
    const emailControl = component.forgetForm.get('email') as FormControl;
    emailControl.setValue('test@example.com');
    component.sendEmail();
    expect(emailService.sendEmail).toHaveBeenCalledWith('test@example.com');
  });
});
