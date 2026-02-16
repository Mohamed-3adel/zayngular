import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/authentication/auth.service';

import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  errorMessage: WritableSignal<string> = signal<string>('');

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  flag: boolean = true;

  refSubscription: Subscription = new Subscription();

  registerForm!: FormGroup;

  registerFormInit(): void {
    this.registerForm = this.fb.group(
      {
        name: [null, [Validators.required, Validators.minLength(3)]],
        email: [null, [Validators.required, Validators.email]],
        password: [
          null,
          [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)],
        ],

        rePassword: [
          null,

          [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)],
        ],
        phone: [
          null,
          [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)],
        ],
      },
      { validators: this.handleConfirmPassword },
    );
  }
  ngOnInit(): void {
    this.registerFormInit();
  }

  handleConfirmPassword(group: AbstractControl) {
    return group.get('password')?.value === group.get('rePassword')?.value
      ? null
      : { missmatch: true };
  }

  submitRegisterForm(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);

      this.refSubscription.unsubscribe();

      this.refSubscription = this.authService.sendRegData(this.registerForm.value).subscribe({
        next: (ress) => {
          this.isLoading.set(false);
          if (ress.message === 'success') {
            this.isLoading.set(false);
            this.registerForm.reset();
            this.errorMessage.set('');
            Swal.fire({
              icon: 'success',
              title: 'Registered!',
              text: 'Redirecting to login...',
              timer: 1500,
              showConfirmButton: false,
            });
            setTimeout(() => this.router.navigate(['/login']), 1500);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error.message || 'Something went wrong!');
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: this.errorMessage(),
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please correct the errors in the form!',
      });
      this.showFirstError();
    }
  }

  showFirstError(): void {
    const controls = this.registerForm.controls;
    for (const controlName in controls) {
      const control = controls[controlName];
      if (control.invalid) {
        control.markAsTouched();
        break;
      }
    }
  }

  togglePasswordType(): void {
    this.flag = !this.flag;
  }
}
