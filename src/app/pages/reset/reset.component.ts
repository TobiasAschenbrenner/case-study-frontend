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

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export default class ResetComponent implements OnInit {
  resetForm!: FormGroup;
  fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  token!: string;

  ngOnInit(): void {
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

    this.activatedRoute.params.subscribe((val) => {
      this.token = val['token'];
      // console.log(this.token);
    });
  }

  reset() {
    console.log(this.resetForm.value);
  }
}
