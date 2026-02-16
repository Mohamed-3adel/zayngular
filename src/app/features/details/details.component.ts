import { Product } from './../../core/models/products/product.interface';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductDetailsService } from '../products/services/product-details/product-details.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDetails } from '../products/models/product-details/product-details.interface';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  ProductId: string | null = null;
  productDetailsData: WritableSignal<ProductDetails | null> = signal<ProductDetails | null>(null);

  ngOnInit(): void {
    this.getProductId();
    this.getProductDetails();
  }

  getProductId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.ProductId = params.get('id');
      },
    });
  }
  getProductDetails(): void {
    this.productDetailsService.getSpecificProduct(this.ProductId).subscribe({
      next: (res) => {
        this.productDetailsData.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'Zaungular');
        } else {
          this.toastrService.warning(res.message || 'Something went wrong', 'Zaungular');
        }
      },
      error: (err) => {
        console.log(err);
        const errorMessage = err.error?.message || err.message || 'Failed to add product to cart';
        this.toastrService.error(errorMessage, 'Error');
      },
    });
  }
}
