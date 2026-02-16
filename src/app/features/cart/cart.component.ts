import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartDetails } from './models/cart-details.interface';
import { CartService } from './services/cart.service';
import { stored_keys } from '../../core/constants/stored-keys';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly plat_id = inject(PLATFORM_ID);

  cartDetailsData: WritableSignal<CartDetails> = signal<CartDetails>({
    _id: '',
    cartOwner: '',
    products: [],
    createdAt: '',
    updatedAt: '',
    __v: 0,
    totalCartPrice: 0,
  });

  isUpdating: WritableSignal<string | null> = signal<string | null>(null);
  isRemoving: WritableSignal<string | null> = signal<string | null>(null);
  isClearingCart: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_id)) {
      const token = localStorage.getItem(stored_keys.userToken);
      if (token) {
        this.getUserCartData();
      }
    }
  }

  getUserCartData(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeItemFromCart(id: string): void {
    this.isRemoving.set(id);
    this.cartService.removeProductFromCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.cartDetailsData.set(res.data);
          this.isRemoving.set(null);
          this.toastrService.success('Product has been removed successfully', '🗑️ Removed', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
          });
        }
      },
      error: (err) => {
        this.isRemoving.set(null);
        this.toastrService.error('Something went wrong. Please try again', '❌ Error', {
          timeOut: 4000,
          progressBar: true,
          closeButton: true,
        });

        console.log(err);
      },
    });
  }

  uptadeProductCount(id: string, count: number): void {
    if (count < 1) {
      this.toastrService.warning('Quantity cannot be less than 1', 'Invalid Quantity');
      return;
    }
    this.isUpdating.set(id);
    this.cartService.uptadeCartQuantity(id, count).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success('Quantity updated successfully', 'Cart Updated');
          this.cartDetailsData.set(res.data);
          this.isUpdating.set(null);
        }
      },
      error: (err) => {
        this.toastrService.error('Failed to update quantity', 'Error');
        this.isUpdating.set(null);
        console.log(err);
      },
    });
  }

  clearAllProduct(): void {
    this.isClearingCart.set(true);
    this.cartService.clearCart().subscribe({
      next: (res) => {
        if (res.message === 'success') {
          this.toastrService.success('All items removed from cart', 'Cart Cleared');
          this.cartDetailsData.set({
            _id: '',
            cartOwner: '',
            products: [],
            createdAt: '',
            updatedAt: '',
            __v: 0,
            totalCartPrice: 0,
          });
        }
        this.isClearingCart.set(false);
      },
      error: (err) => {
        this.toastrService.error('Failed to clear cart', 'Error');
        this.isClearingCart.set(false);
        console.log(err);
      },
    });
  }
}
