import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WishlistProductsResponse, WishlistResponse } from '../../models/wishlist/wishlist.interface';
import { stored_keys } from '../../constants/stored-keys';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  
  wishlistCount: BehaviorSubject<number> = new BehaviorSubject(0);
  wishlistIds: WritableSignal<Set<string>> = signal(new Set<string>());

  constructor() {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.loadWishlistFromLocalStorage();
    }
  }

  addToWishlist(productId: string): Observable<WishlistResponse> {
    return this._HttpClient.post<WishlistResponse>(`${environment.base_url}wishlist`, { productId }).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.updateLocalState(response.data);
        }
      })
    );
  }

  removeFromWishlist(productId: string): Observable<WishlistResponse> {
    return this._HttpClient.delete<WishlistResponse>(`${environment.base_url}wishlist/${productId}`).pipe(
      tap(response => {
        if (response.status === 'success') {
          this.updateLocalState(response.data);
        }
      })
    );
  }

  getWishlist(): Observable<WishlistProductsResponse> {
    if (isPlatformBrowser(this._PLATFORM_ID) && localStorage.getItem(stored_keys.userToken)) {
      return this._HttpClient.get<WishlistProductsResponse>(`${environment.base_url}wishlist`).pipe(
        tap(response => {
          if (response.status === 'success') {
            this.wishlistCount.next(response.count);
            const ids = response.data.map(item => item.id);
            this.updateLocalState(ids);
          }
        })
      );
    }
    return new Observable(observer => {
      observer.next({ status: 'success', count: 0, data: [] } as WishlistProductsResponse);
      observer.complete();
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds().has(productId);
  }

  private updateLocalState(ids: string[]): void {
    const uniqueIds = new Set(ids);
    this.wishlistIds.set(uniqueIds);
    this.wishlistCount.next(ids.length);
    
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.saveWishlistToLocalStorage(ids);
    }
  }

  private saveWishlistToLocalStorage(ids: string[]): void {
    localStorage.setItem('wishlistIds', JSON.stringify(ids));
  }

  private loadWishlistFromLocalStorage(): void {
    const storedIds = localStorage.getItem('wishlistIds');
    if (storedIds) {
      const ids = JSON.parse(storedIds);
      this.wishlistIds.set(new Set(ids));
      this.wishlistCount.next(ids.length);
    }
    // Ideally synchronize with server on load if token exists, 
    // but relying on getWishlist() call in component for now.
  }

  clearWishlistLocal(): void {
    this.wishlistIds.set(new Set());
    this.wishlistCount.next(0);
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      localStorage.removeItem('wishlistIds');
    }
  }
}
