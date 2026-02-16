import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartDataResponse } from '../models/cart-data.interface';
import { CartDetailsResponse } from '../models/cart-details.interface';
import { PaymentResponse } from '../models/payment.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  cartCount: WritableSignal<number> = signal<number>(0);

  private updateCartCount(count: number): void {
    this.cartCount.set(count);
  }

  addProductToCart(id: string): Observable<CartDataResponse> {
    return this.httpClient
      .post<CartDataResponse>(environment.base_url + 'cart', {
        productId: id,
      })
      .pipe(
        tap((res) => {
          if (res.status === 'success') {
            this.updateCartCount(res.numOfCartItems);
          }
        }),
      );
  }

  getUserCart(): Observable<CartDetailsResponse> {
    return this.httpClient.get<CartDetailsResponse>(environment.base_url + 'cart').pipe(
      tap((res) => {
        if (res.status === 'success') {
          this.updateCartCount(res.numOfCartItems);
        }
      }),
    );
  }

  removeProductFromCart(id: string): Observable<CartDetailsResponse> {
    return this.httpClient.delete<CartDetailsResponse>(environment.base_url + `cart/${id}`).pipe(
      tap((res) => {
        if (res.status === 'success') {
          this.updateCartCount(res.numOfCartItems);
        }
      }),
    );
  }

  uptadeCartQuantity(id: string, count: number): Observable<CartDetailsResponse> {
    return this.httpClient
      .put<CartDetailsResponse>(environment.base_url + `cart/${id}`, {
        count: count,
      })
      .pipe(
        tap((res) => {
          if (res.status === 'success') {
            this.updateCartCount(res.numOfCartItems);
          }
        }),
      );
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(environment.base_url + 'cart').pipe(
      tap(() => {
        this.updateCartCount(0);
      }),
    );
  }

  checkoutSession(
    cartId: string | null,
    checkoutData: object,
    url: string,
  ): Observable<PaymentResponse> {
    return this.httpClient.post<PaymentResponse>(
      environment.base_url + `orders/checkout-session/${cartId}?url=${url}`,
      checkoutData,
    );
  }

  createCashOrder(cartId: string | null, checkoutData: object): Observable<any> {
    return this.httpClient.post<any>(environment.base_url + `orders/${cartId}`, checkoutData).pipe(
      tap(() => {
        this.updateCartCount(0);
      }),
    );
  }
}
