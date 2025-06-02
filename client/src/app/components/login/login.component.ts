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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  isInvalid(control: string): boolean {
    const field = this.loginForm.get(control);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/boards']);
      },
      error: (err) => (this.errorMessage = err.error.message || 'Login failed'),
    });
  }
}
