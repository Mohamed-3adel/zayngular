import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../core/models/products/product.interface';
import { PopupDirective } from '../../shared/directives/popup.directive';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private readonly _WishlistService = inject(WishlistService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  wishlistProducts: WritableSignal<Product[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  isProcessing: Set<string> = new Set(); 

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this._WishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistProducts.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  removeFromWishlist(productId: string): void {
    this.isProcessing.add(productId);
    this._WishlistService.removeFromWishlist(productId).subscribe({
      next: (response) => {
        // Remove from local list to reflect UI immediately
        this.wishlistProducts.update(products => products.filter(p => p.id !== productId));
        this._ToastrService.info('Item removed from wishlist', 'Removed');
        this.isProcessing.delete(productId);
      },
      error: (err) => {
        console.error(err);
        this._ToastrService.error('Failed to remove item', 'Error');
        this.isProcessing.delete(productId);
      }
    });
  }

  addToCart(productId: string): void {
    this.isProcessing.add(productId);
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this._ToastrService.success('Item added to cart', 'Success');
        this.isProcessing.delete(productId);
      },
      error: (err) => {
        console.log(err);
        this._ToastrService.error('Failed to add to cart', 'Error');
        this.isProcessing.delete(productId);
      }
    });
  }

  moveToCart(productId: string): void {
    this.isProcessing.add(productId);
    // Add to cart first
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this._ToastrService.success('Item moved to cart', 'Success');
        
        // Then remove from wishlist
        this._WishlistService.removeFromWishlist(productId).subscribe({
            next: () => {
                 this.wishlistProducts.update(products => products.filter(p => p.id !== productId));
                 this.isProcessing.delete(productId);
            }
        });
      },
      error: (err) => {
        console.log(err);
        this._ToastrService.error('Failed to move to cart', 'Error');
        this.isProcessing.delete(productId);
      }
    });
  }
}
