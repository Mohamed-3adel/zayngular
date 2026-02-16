import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../core/models/products/product.interface';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { PopupDirective } from '../../directives/popup.directive';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, PopupDirective],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  @Input() productData: Product = {} as Product;
  isAddingToCart = false;

  addProductItemToCart(id: string): void {
    this.isAddingToCart = true;

    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.isAddingToCart = false;

        if (res.status === 'success') {
          this.toastrService.success(res.message, 'Zsungular');
        } else {
          this.toastrService.warning(res.message || 'Something went wrong', 'Zsungular');
        }
      },
      error: (err) => {
        this.isAddingToCart = false;

        console.log(err);
        const errorMessage = err.error?.message || err.message || 'Failed to add product to cart';
        this.toastrService.error(errorMessage, 'Error');
      },
    });
  }

  addToCartFromPopup(product: Product): void {
    if (product && product.id) {
      this.addProductItemToCart(product.id);
    }
  }

  isInWishlist(id: string): boolean {
    return this.wishlistService.isInWishlist(id);
  }

  toggleWishlist(id: string): void {
    if (this.isInWishlist(id)) {
      this.wishlistService.removeFromWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.info('Removed from wishlist', 'Zayngular');
        },
      });
    } else {
      this.wishlistService.addToWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.success('Added to wishlist', 'Zayngular');
        },
      });
    }
  }
}
