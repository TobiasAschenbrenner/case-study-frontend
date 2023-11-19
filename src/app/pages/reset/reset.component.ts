import { confirmPasswordValidator } from './../../validators/confirm-password.validator';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password/password.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export default class ResetComponent implements OnInit {
  resetForm!: FormGroup;
  token!: string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private passwordService: PasswordService
  ) {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
        confirmPassword: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.token = val['token'];
    });
  }

  reset() {
    if (this.resetForm.valid) {
      const resetObj = {
        token: this.token,
        password: this.resetForm.value.password,
      };

      this.passwordService.resetPassword(resetObj).subscribe({
        next: (res) => {
          console.log('Password Reset Successfully');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Reset error:', err);
        },
      });
    } else {
      console.log('Invalid form or token');
    }
  }
}
