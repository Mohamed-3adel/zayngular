import { isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';

type PaymentMethod = 'visa' | 'cash';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly fb = inject(FormBuilder);
  private readonly plat_Id = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  // Signals for reactive state management
  readonly cartId = signal<string | null>(null);
  readonly selectedPaymentMethod = signal<PaymentMethod>('visa');
  readonly isProcessing = signal<boolean>(false);

  // Computed signal for button text
  readonly submitButtonText = computed(() => {
    if (this.isProcessing()) {
      return 'Processing...';
    }
    return this.selectedPaymentMethod() === 'visa' ? 'Pay with Visa' : 'Confirm Cash Order';
  });

  // Computed signal for payment method validation
  readonly isPaymentMethodSelected = computed(() => {
    return this.selectedPaymentMethod() !== null;
  });

  cheoutForm!: FormGroup;

  ngOnInit(): void {
    this.chekoutFormInit();
    this.getCrtId();
  }

  chekoutFormInit(): void {
    this.cheoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [
          null,
          [Validators.required, Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)],
        ],
        city: [null, [Validators.required]],
        address: [null, [Validators.required]],
      }),
    });
  }

  getCrtId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParams) => {
        const id = urlParams.get('id');
        this.cartId.set(id);
      },
      error: (err) => {
        console.error('Error getting cart ID:', err);
      },
    });
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  submiitCheckoutForm(): void {
    if (!this.cheoutForm.valid) {
      this.markFormGroupTouched(this.cheoutForm);
      return;
    }

    if (this.isProcessing()) {
      return; // Prevent double submission
    }

    this.isProcessing.set(true);
    this.saveUserIdToLocalStorage();

    const paymentMethod = this.selectedPaymentMethod();

    if (paymentMethod === 'visa') {
      this.processVisaPayment();
    } else {
      this.processCashPayment();
    }
  }

  private processVisaPayment(): void {
    this.cartService
      .checkoutSession(this.cartId(), this.cheoutForm.value, window.location.origin)
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.cartService.clearCart();
            window.open(res.session.url, '_self');
          }
          this.isProcessing.set(false);
        },
        error: (err) => {
          console.error('Visa payment error:', err);
          this.isProcessing.set(false);
          alert('Payment failed. Please try again.');
        },
      });
  }

  private processCashPayment(): void {
    this.cartService.createCashOrder(this.cartId(), this.cheoutForm.value).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.isProcessing.set(false);

          this.toastrService.success('We will contact you soon.', 'Order placed successfully!', {
            timeOut: 4000,
            progressBar: true,
            closeButton: true,
          });

          this.router.navigate(['/allorders']);
        }
      },
      error: (err) => {
        console.error('Cash order error:', err);
        this.isProcessing.set(false);

        this.toastrService.error('Please try again.', 'Order failed', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
        });
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  saveUserIdToLocalStorage(): void {
    if (isPlatformBrowser(this.plat_Id)) {
      const token = localStorage.getItem('userToken');
      if (token) {
        const decoded: any = jwtDecode(token);
        localStorage.setItem('userId', decoded.id);
      }
    }
  }
}
