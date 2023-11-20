import { AuthService } from 'src/app/services/auth/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/validators/confirm-password.validator';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export default class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: [
          '',
          Validators.compose([Validators.required, Validators.minLength(4)]),
        ],
        email: [
          '',
          Validators.compose([Validators.required, Validators.email]),
        ],
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {}

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (registerRes) => {
        console.log('User Created Successfully');

        const loginCredentials = {
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
        };
        this.registerForm.reset();

        this.authService.login(loginCredentials).subscribe({
          next: (loginRes) => {
            console.log('User Logged In Successfully');
            this.router.navigate(['home']);
          },
          error: (loginErr) => {
            console.error('Login error:', loginErr);
          },
        });
      },
      error: (registerErr) => {
        console.log('Registration error:', registerErr);
      },
    });
  }
}
