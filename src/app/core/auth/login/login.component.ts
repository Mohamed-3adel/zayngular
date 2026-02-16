import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/authentication/auth.service';
import { Subscription } from 'rxjs';
import { stored_keys } from '../../constants/stored-keys';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  errorMessage: WritableSignal<string> = signal<string>('');

  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  flag: boolean = true;
  refSubscription: Subscription = new Subscription();
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginFormInit();
  }

  loginFormInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)],
      ],
    });
  }

  submitLoginerForm(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      this.refSubscription.unsubscribe();

      this.refSubscription = this.authService.sendLoginData(this.loginForm.value).subscribe({
        next: (ress) => {
          if (ress.message === 'success') {
            this.isLoading.set(false);
            this.errorMessage.set('');
            Swal.fire({
              icon: 'success',
              title: 'Login successful!',
              text: 'Redirecting to the home page...',
              timer: 1500,
              showConfirmButton: false,
            });

            localStorage.setItem(stored_keys.userToken, ress.token);
            this.authService.decodeUserToken();

            // Load cart after successful login
            this.cartService.getUserCart().subscribe();
            this.wishlistService.getWishlist().subscribe();

            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
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
    const controls = this.loginForm.controls;
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
