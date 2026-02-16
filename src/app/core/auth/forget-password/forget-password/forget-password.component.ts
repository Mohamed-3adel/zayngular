import { Component, inject, WritableSignal, signal, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  forgotPasswordForm!: FormGroup;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  successMessage: WritableSignal<string> = signal<string>('');

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const email = this.forgotPasswordForm.get('email')?.value;

    this.authService.forgotPasswords(email).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        Swal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text:
            response.message ||
            response.statusMsg ||
            'Password reset link has been sent to your email',
          confirmButtonText: 'OK',
          confirmButtonColor: '#4F46E5',
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          this.forgotPasswordForm.reset();
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.isLoading.set(false);

        let errorTitle = 'Oops...';
        let errorMsg = 'Failed to send reset link. Please try again.';
        let icon: 'error' | 'warning' = 'error';

        if (error.status === 500 && error.error?.message?.includes('sending the email')) {
          icon = 'warning';
          errorTitle = 'Service Temporarily Unavailable';
          errorMsg =
            'The email service is currently experiencing issues. Please try again later or contact support.';
        } else if (error.status === 404) {
          errorMsg = 'Email address not found. Please check and try again.';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.statusMsg) {
          errorMsg = error.error.statusMsg;
        } else if (error.status === 500) {
          errorMsg = 'Server error. Please try again later.';
        }

        Swal.fire({
          icon: icon,
          title: errorTitle,
          text: errorMsg,
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#4F46E5',
          footer:
            error.status === 500
              ? '<small>If the problem persists, please contact support</small>'
              : undefined,
        });
      },
    });
  }
}
