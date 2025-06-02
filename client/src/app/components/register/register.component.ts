import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5" style="max-width: 400px;">
      <h2 class="mb-4 text-center">Register</h2>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            id="name"
            class="form-control"
            formControlName="name"
            [ngClass]="{ 'is-invalid': isInvalid('name') }"
          />
          <div *ngIf="isInvalid('name')" class="invalid-feedback">
            Name is required.
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            class="form-control"
            formControlName="email"
            [ngClass]="{ 'is-invalid': isInvalid('email') }"
          />
          <div *ngIf="isInvalid('email')" class="invalid-feedback">
            Valid email is required.
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            class="form-control"
            formControlName="password"
            [ngClass]="{ 'is-invalid': isInvalid('password') }"
          />
          <div *ngIf="isInvalid('password')" class="invalid-feedback">
            Password must be at least 6 characters.
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100"
          [disabled]="registerForm.invalid"
        >
          Register
        </button>
      </form>

      <p class="mt-3 text-center">
        Already have an account?
        <a routerLink="/login">Login</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isInvalid(control: string): boolean {
    const field = this.registerForm.get(control);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) =>
        (this.errorMessage = err.error.message || 'Registration failed'),
    });
  }
}
