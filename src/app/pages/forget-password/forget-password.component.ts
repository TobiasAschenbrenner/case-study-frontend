import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailService } from 'src/app/services/email/email.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export default class ForgetPasswordComponent implements OnInit {
  forgetForm!: FormGroup;
  constructor(private fb: FormBuilder, private emailService: EmailService) {}

  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  sendEmail(): void {
    if (this.forgetForm.valid) {
      this.emailService.sendEmail(this.forgetForm.value.email).subscribe({
        next: (res) => {
          console.log('Email Sent Successfully');
          this.forgetForm.reset();
        },
        error: (err) => {
          console.log('Failed to send email', err);
        },
      });
    }
  }
}
